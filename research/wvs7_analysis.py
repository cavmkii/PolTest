# Reliability, axis correlations, left-right correlations and factor analysis. Run after wvs7_recode.py.
import pandas as pd, numpy as np
from factor_analyzer import FactorAnalyzer
X=pd.read_pickle('items.pkl'); M=pd.read_pickle('meta.pkl')
w=M.w.values
# z-score items pooled
Z=(X-X.mean())/X.std()
# within-country centered (subtract country means), then z
Xc=X-X.groupby(M.c).transform('mean'); Zc=(Xc-Xc.mean())/Xc.std()
axes=['econ','power','culture','faith','belong','nation','war','justice','ecology','method']
def items(a): return [c for c in X.columns if c.startswith(a+'_')]
def alpha(D):
    D=D.dropna(); k=D.shape[1]
    if k<2: return np.nan
    return k/(k-1)*(1-D.var().sum()/D.sum(axis=1).var())
def wcorr(a,b,w):
    m=a.notna()&b.notna(); a,b,ww=a[m],b[m],w[m.values]
    ma,mb=np.average(a,weights=ww),np.average(b,weights=ww)
    return np.average((a-ma)*(b-mb),weights=ww)/np.sqrt(np.average((a-ma)**2,weights=ww)*np.average((b-mb)**2,weights=ww))
out=[]
out.append('## Reliability (Cronbach alpha) and item counts')
for a in axes:
    it=items(a); out.append(f'{a:8s} items={len(it)}  alpha pooled={alpha(Z[it]):.2f}  within-country={alpha(Zc[it]):.2f}')
S=pd.DataFrame({a:Z[items(a)].mean(axis=1,skipna=True) for a in axes})
Sc=pd.DataFrame({a:Zc[items(a)].mean(axis=1,skipna=True) for a in axes})
for name,SS in [('pooled',S),('within-country',Sc)]:
    C=pd.DataFrame(index=axes,columns=axes,dtype=float)
    for i in axes:
        for j in axes: C.loc[i,j]=1.0 if i==j else wcorr(SS[i],SS[j],w)
    out.append(f'\n## Axis score correlations ({name}, weighted by S018)\n'+C.round(2).to_string())
lr=M.lr
lrc=lr-lr.groupby(M.c).transform('mean')
out.append('\n## Correlation with left-right self-placement (Q240, 1=left..10=right)')
for a in axes: out.append(f'{a:8s} pooled={wcorr(S[a],lr,w):+.2f}  within-country={wcorr(Sc[a],lrc,w):+.2f}')
# EFA on within-country items, listwise (own implementation: principal axis factoring + promax)
def paf(Rm,k,it=200):
    h=1-1/np.diag(np.linalg.inv(Rm))
    for _ in range(it):
        Rr=Rm.copy(); np.fill_diagonal(Rr,h)
        ev,vec=np.linalg.eigh(Rr); idx=np.argsort(ev)[::-1][:k]
        L=vec[:,idx]*np.sqrt(np.clip(ev[idx],0,None))
        hn=(L**2).sum(1)
        if np.max(abs(hn-h))<1e-5: break
        h=hn
    return L
def varimax(L,it=100,tol=1e-6):
    p,k=L.shape; R=np.eye(k); d=0
    for _ in range(it):
        Lr=L@R
        u,s,vt=np.linalg.svd(L.T@(Lr**3-Lr@np.diag((Lr**2).sum(0))/p))
        R=u@vt; dn=s.sum()
        if dn<d*(1+tol): break
        d=dn
    return L@R
def promax(L,m=4):
    V=varimax(L); h=np.sqrt((V**2).sum(1,keepdims=True)); Vn=V/h
    P=np.abs(Vn)**(m-1)*Vn
    U=np.linalg.lstsq(V,P,rcond=None)[0]
    U=U@np.diag(np.sqrt(np.diag(np.linalg.inv(U.T@U))))
    Lp=V@U; phi=np.linalg.inv(U.T@U)
    return Lp,phi
D=Zc.dropna()
Rm=np.corrcoef(D.values,rowvar=False)
out.append(f'\n## Exploratory factor analysis, within-country, listwise N={len(D)}, {D.shape[1]} items')
ev=np.sort(np.linalg.eigvalsh(Rm))[::-1]
rng=np.random.default_rng(0); sims=[]
for _ in range(20):
    Rn=rng.standard_normal(D.shape); sims.append(np.sort(np.linalg.eigvalsh(np.corrcoef(Rn,rowvar=False)))[::-1])
thr=np.percentile(np.array(sims),95,axis=0)
nf=int(np.argmin(ev>thr))
out.append('eigenvalues: '+' '.join(f'{e:.2f}' for e in ev[:12]))
out.append('parallel-analysis 95% thresholds: '+' '.join(f'{t:.2f}' for t in thr[:12]))
out.append(f'factors retained by parallel analysis: {nf}')
for k in sorted(set([2,nf])):
    L=paf(Rm,k); Lp,phi=promax(L)
    # orient each factor so its largest loading is positive
    sg=np.sign(Lp[np.abs(Lp).argmax(0),range(k)]); Lp=Lp*sg; phi=phi*np.outer(sg,sg)
    Ld=pd.DataFrame(Lp,index=D.columns,columns=[f'F{i+1}' for i in range(k)])
    out.append(f'\n### {k}-factor solution (principal axis, promax); variance explained by unrotated factors: '+f'{(L**2).sum()/D.shape[1]:.3f}')
    for i in Ld.index:
        r=Ld.loc[i]; out.append(f'{i:34s} '+' '.join(f'{x:+.2f}' for x in r)+f'   -> {r.abs().idxmax()} ({r.abs().max():.2f})')
    out.append('factor correlations:\n'+pd.DataFrame(phi,index=Ld.columns,columns=Ld.columns).round(2).to_string())
open('wvs_results.txt','w').write('\n'.join(out))
print('\n'.join(out))
