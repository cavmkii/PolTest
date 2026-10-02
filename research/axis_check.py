"""Shared analysis: reliability, axis correlations, self-placement correlations and exploratory
factor analysis (principal axis + promax, parallel analysis) for items recoded onto the test's axes."""
import pandas as pd, numpy as np
AXES=['econ','power','culture','faith','belong','nation','war','justice','ecology','method','pop']
def wcorr(a,b,w):
    m=a.notna()&b.notna(); a,b,ww=a[m],b[m],w[m.values]
    if len(a)<30: return np.nan
    ma,mb=np.average(a,weights=ww),np.average(b,weights=ww)
    return np.average((a-ma)*(b-mb),weights=ww)/np.sqrt(np.average((a-ma)**2,weights=ww)*np.average((b-mb)**2,weights=ww))
def alpha(D):
    D=D.dropna(); k=D.shape[1]
    if k<2 or len(D)<30: return np.nan
    return k/(k-1)*(1-D.var().sum()/D.sum(axis=1).var())
def paf(Rm,k,it=300):
    h=1-1/np.diag(np.linalg.inv(Rm))
    for _ in range(it):
        Rr=Rm.copy(); np.fill_diagonal(Rr,h)
        ev,vec=np.linalg.eigh(Rr); idx=np.argsort(ev)[::-1][:k]
        L=vec[:,idx]*np.sqrt(np.clip(ev[idx],0,None)); hn=np.clip((L**2).sum(1),0,0.995)
        if np.max(abs(hn-h))<1e-5: break
        h=hn
    return L
def varimax(L,it=200,tol=1e-7):
    p,k=L.shape; R=np.eye(k); d=0
    for _ in range(it):
        Lr=L@R; u,s,vt=np.linalg.svd(L.T@(Lr**3-Lr@np.diag((Lr**2).sum(0))/p)); R=u@vt
        if s.sum()<d*(1+tol): break
        d=s.sum()
    return L@R
def promax(L,m=4):
    V=varimax(L); Vn=V/np.sqrt((V**2).sum(1,keepdims=True)); P=np.abs(Vn)**(m-1)*Vn
    U=np.linalg.lstsq(V,P,rcond=None)[0]; U=U@np.diag(np.sqrt(np.diag(np.linalg.inv(U.T@U))))
    return V@U, np.linalg.inv(U.T@U)
def run(X,w,lr,lrname,country=None,title=''):
    out=[f'# {title}','']
    axes=[a for a in AXES if any(c.startswith(a+'_') for c in X.columns)]
    items=lambda a:[c for c in X.columns if c.startswith(a+'_')]
    Z=(X-X.mean())/X.std()
    variants=[('pooled',Z,lr)]
    if country is not None:
        Xc=X-X.groupby(country).transform('mean'); Zc=(Xc-Xc.mean())/Xc.std()
        variants.append(('within-country',Zc,lr-lr.groupby(country).transform('mean')))
    out.append('## Reliability (Cronbach alpha)')
    for a in axes:
        out.append(f'{a:8s} items={len(items(a))}  '+'  '.join(f'{n}={alpha(Zv[items(a)]):.2f}' for n,Zv,_ in variants))
    for n,Zv,lv in variants:
        S=pd.DataFrame({a:Zv[items(a)].mean(axis=1) for a in axes})
        C=pd.DataFrame([[1.0 if i==j else wcorr(S[i],S[j],w) for j in axes] for i in axes],index=axes,columns=axes)
        out.append(f'\n## Axis score correlations ({n}, weighted)\n'+C.round(2).to_string())
        out.append(f'\n## Correlation with {lrname} ({n})')
        for a in axes: out.append(f'{a:8s} {wcorr(S[a],lv,w):+.2f}')
        if country is not None and n=='pooled':
            out.append('\n## Share of variance between countries')
            for a in axes:
                s=S[a]; g=s.groupby(country).transform('mean'); out.append(f'{a:8s} {g.var()/s.var():.2f}')
    n,Zv,_=variants[-1]
    D=Zv.dropna(thresh=int(0.8*Zv.shape[1]))
    D=D.fillna(0)  # mean imputation (z-scores) for the few remaining gaps
    Rm=np.corrcoef(D.values,rowvar=False)
    ev=np.sort(np.linalg.eigvalsh(Rm))[::-1]
    rng=np.random.default_rng(0)
    thr=np.percentile([np.sort(np.linalg.eigvalsh(np.corrcoef(rng.standard_normal(D.shape),rowvar=False)))[::-1] for _ in range(20)],95,axis=0)
    nf=int(np.argmin(ev>thr))
    out.append(f'\n## Exploratory factor analysis ({n}), N={len(D)} with at least 80% of items answered, {D.shape[1]} items')
    out.append('eigenvalues: '+' '.join(f'{e:.2f}' for e in ev[:12]))
    out.append('parallel-analysis 95% thresholds: '+' '.join(f'{t:.2f}' for t in thr[:12]))
    out.append(f'factors retained by parallel analysis: {nf}')
    for k in sorted(set([2,nf])):
        L=paf(Rm,k); Lp,phi=promax(L)
        sg=np.sign(Lp[np.abs(Lp).argmax(0),range(k)]); Lp=Lp*sg; phi=phi*np.outer(sg,sg)
        Ld=pd.DataFrame(Lp,index=D.columns,columns=[f'F{i+1}' for i in range(k)])
        out.append(f'\n### {k}-factor solution (principal axis, promax); variance explained: {(L**2).sum()/D.shape[1]:.3f}')
        for i in Ld.index:
            r=Ld.loc[i]; out.append(f'{i:34s} '+' '.join(f'{x:+.2f}' for x in r)+f'   -> {r.abs().idxmax()} ({r.abs().max():.2f})')
        out.append('factor correlations:\n'+pd.DataFrame(phi,index=Ld.columns,columns=Ld.columns).round(2).to_string())
    return '\n'.join(out)
