# Builds the president and head-of-government profiles: blends record-based scores with V-Party party codes,
# Herre (2023) economic codes and Global Populism Database scores. Needs the V-Party data (vdemdata package)
# and the Herre dataset locally; paths below point to a scratch directory.
import re, json, pandas as pd, numpy as np
S='/tmp/claude-0/-home-user-PolTest/813bb91f-95f5-516e-8f63-16d5a2cbf060/scratchpad'
vp=pd.read_pickle(S+'/vparty.pkl')
AX=['econ','power','culture','nation','faith','belong','war','justice','ecology','method','pop']
def party(country,pat,years):
    d=vp[(vp.country_name.str.contains(country,na=False))&(vp.v2paenname.str.contains(pat,na=False,regex=True))&(vp.year.isin(years))]
    cols=['v2pariglef_osp','v2paimmig_osp','v2parelig_osp','v2palgbt_osp','v2paplur_osp','v2paviol_osp','v2xpa_popul']
    d=d[cols].dropna(how='all')
    if d.empty: return None
    return d.mean().to_dict()
def anchors(p, lgbt_ok=True):
    if not p: return {}
    # Only policy positions are blended; a party's commitment to pluralism or stance on violence says too little
    # about an individual leader's own conduct, so State power and Means stay with the record.
    a={'econ':(p['v2pariglef_osp']-3)/3*100,'belong':(2-p['v2paimmig_osp'])*50,'faith':(2-p['v2parelig_osp'])*50,
       'pop':150*p['v2xpa_popul']-60}
    if lgbt_ok: a['culture']=(2-p['v2palgbt_osp'])*50
    return {k:max(-100,min(100,v)) for k,v in a.items() if v==v}
HERRE={'leftist':-50,'centrist':0,'rightist':50}
gpd=lambda s: round(75*s-50)
def blend(v,anc,herre=None,gpdscore=None):
    v=list(v)
    for k,val in anc.items():
        i=AX.index(k)
        if k=='pop': continue
        parts=[x for x in [v[i],val] if x is not None]
        if k=='econ' and herre is not None: parts.append(HERRE[herre])
        v[i]=round(sum(parts)/len(parts))
    if 'econ' not in anc and herre is not None and v[0] is not None:
        v[0]=round((v[0]+HERRE[herre])/2)
    if gpdscore is not None: v[10]=gpd(gpdscore)
    elif 'pop' in anc: v[10]=round(anc['pop'])
    return v
def vdesc(p,label):
    return (f"V-Party (Lührmann et al. 2020), {label}: economy {p['v2pariglef_osp']:.1f} of 6 (0 = far left), "
            f"immigration {p['v2paimmig_osp']:.1f} of 4 (0 = strongly against), religious appeals {p['v2parelig_osp']:.1f} of 4 (0 = constant), "
            f"LGBT equality {p['v2palgbt_osp']:.1f} of 4 (0 = strongly against), populism index {p['v2xpa_popul']:.2f}")
js=lambda x: "'"+x.replace("\\","\\\\").replace("'","\\'")+"'"
def entry(n,c,y,l,conf,v,note,src,flag=None):
    vv='['+', '.join('null' if x is None else str(int(x)) for x in v)+']'
    out=f"  {{ n: {js(n)}, c: '{c}', y: {js(y)}, l: {js(l)}, conf: '{conf}',\n    v: {vv},\n    note: {js(note)},\n    src: [{', '.join(js(x) for x in src)}]"
    if flag: out+=f",\n    flag: {js(flag)}"
    return out+' },\n'

# ---- presidents: parse earlier entries
pres_src=open(S+'/presidents_v1.js').read()
P=[]
for m in re.finditer(r"\{ n: '((?:[^'\\]|\\.)*)', c: 'president', y: '([^']*)', l: '((?:[^'\\]|\\.)*)', conf: '(\w+)',\s*v: \[([^\]]*)\],\s*note: '((?:[^'\\]|\\.)*)' \}",pres_src):
    n,y,l,conf,v,note=m.groups()
    v=[None if t.strip()=='null' else int(t) for t in v.split(',')]+[None]
    P.append(dict(n=n.replace("\\'","'"),y=y,l=l.replace("\\'","'"),conf=conf,v=v,note=note.replace("\\'","'")))
assert len(P)==45, len(P)
H={'Harry S. Truman':'centrist','Dwight D. Eisenhower':'rightist','John F. Kennedy':'centrist','Lyndon B. Johnson':'centrist',
   'Richard Nixon':'rightist','Gerald Ford':'rightist','Jimmy Carter':'centrist','Ronald Reagan':'rightist','George H. W. Bush':'rightist',
   'Bill Clinton':'centrist','George W. Bush':'rightist','Barack Obama':'centrist','Donald Trump':'rightist'}
VP={'Richard Nixon':('Republican',[1972],'Republican Party 1972'),'Gerald Ford':('Republican',[1976],'Republican Party 1976'),
    'Jimmy Carter':('Democratic',[1976],'Democratic Party 1976'),'Ronald Reagan':('Republican',[1980,1984],'Republican Party 1980–84'),
    'George H. W. Bush':('Republican',[1988],'Republican Party 1988'),'Bill Clinton':('Democratic',[1992,1996],'Democratic Party 1992–96'),
    'George W. Bush':('Republican',[2000,2004],'Republican Party 2000–04'),'Barack Obama':('Democratic',[2008,2012],'Democratic Party 2008–12'),
    'Donald Trump':('Republican',[2016,2018],'Republican Party 2016–18'),'Joe Biden':('Democratic',[2018],'Democratic Party 2018 (latest year coded)')}
GPDP={'George W. Bush':(0.20,'mean of 2 terms: 0.21, 0.19'),'Barack Obama':(0.22,'mean of 2 terms: 0.15, 0.29'),'Donald Trump':(0.78,'2017–2020 term')}
out=['  // ---- US presidents, in order ----\n']
for p in P:
    src=[];flag=None;herre=H.get(p['n']);anc={}
    if p['n'] in VP:
        pat,yrs,lab=VP[p['n']]; pr=party('United States',pat,yrs); anc=anchors(pr, lgbt_ok=min(yrs)>=1990)
        src.append(vdesc(pr,lab))
    if herre: src.insert(0,f'Herre (2023), Global Leader Ideologies: coded {herre}')
    g=GPDP.get(p['n'])
    if g: src.append(f'Global Populism Database v2.1 (Hawkins et al.): populism {g[0]:.2f} on a 0–2 scale ({g[1]})')
    v=blend(p['v'],anc,herre,g[0] if g else None)
    if anc: flag='Economy, immigration and religion (and LGBT rights from 1990) blend the record with V-Party codes for the president\'s party at election; the party is not the person.'
    elif herre: flag='Economy blends the record with Herre\'s party-based code; other axes are scored from the record.'
    else: flag='No dataset covers this presidency; every axis is scored from the historical record, placed on the present-day spectrum.'
    if not src: src=['Historical record of the administration; no ideology dataset covers it']
    out.append(entry(p['n'],'president',p['y'],p['l'],p['conf'],v,p['note'],src,flag))
open(S+'/presidents_new.js','w').write(''.join(out))

# ---- world leaders
L=[
 ('Winston Churchill','UK, 1940–45, 1951–55','Conservative imperialist','medium',[40,40,60,60,30,60,80,60,None,-60,None],
  'Led Britain through the Second World War; opposed Indian self-rule and defended the empire; accepted much of the postwar welfare state on returning in 1951.',
  None,'rightist',None,['Roberts, Churchill: Walking with Destiny (2018)']),
 ('Charles de Gaulle','France, 1944–46, 1958–69','Gaullism','medium',[10,60,60,90,40,30,40,60,None,-20,None],
  'Founded the Fifth Republic with a strong presidency, ended the Algerian war, withdrew France from NATO\'s integrated command, vetoed British entry to the EEC.',
  None,'rightist',None,['Jackson, A Certain Idea of France (2018)']),
 ('Konrad Adenauer','West Germany, 1949–63','Christian democracy','medium',[30,30,50,-40,60,10,30,40,None,-80,None],
  'First chancellor of the Federal Republic: social market economy, Western integration and NATO membership, reconciliation with France.',
  None,'rightist',None,['Williams, Adenauer: The Father of the New Germany (2000)']),
 ('Margaret Thatcher','UK, 1979–90','Thatcherism (neoliberal conservatism)','high',None,None,('United Kingdom','Conservatives',[1979,1983,1987],'Conservatives 1979–87'),'rightist',None,[]),
 ('Tony Blair','UK, 1997–2007','Third Way social democracy','high',[10,40,-30,-60,10,-30,80,50,-10,-80,None],
  'New Labour: minimum wage, Bank of England independence, devolution, the Good Friday Agreement, the Iraq War, tougher criminal justice ("tough on crime, tough on the causes of crime").',
  ('United Kingdom','Labour',[1997,2001,2005],'Labour 1997–2005'),'leftist',(0.11,'mean of 2 terms: 0.10, 0.13'),['Seldon, Blair (2004)']),
 ('Angela Merkel','Germany, 2005–21','Christian democracy','high',[20,0,0,-70,20,-40,-10,20,-40,-90,None],
  'Led through the euro crisis and the 2015 refugee intake; phased out nuclear power; allowed a free vote that legalized same-sex marriage in 2017 while voting against it herself.',
  ('Germany','^Christian Democratic Union$',[2005,2009,2013,2017],'CDU 2005–17'),'rightist',(0.03,'mean of 3 terms: 0.00, 0.05, 0.04'),['Kornelius, Angela Merkel: The Chancellor and Her World (2013)']),
 ('Emmanuel Macron','France, 2017–','Liberal centrism','high',[30,20,-30,-80,-40,-20,20,30,-20,-80,None],
  'Founded En Marche outside the old parties; labor-market and pension reforms; strongly pro-EU; tightened immigration law in 2023.',
  ('France','Republic Onwards',[2017],'La République En Marche 2017'),None,(0.15,'2017–2022 term'),[]),
 ('Justin Trudeau','Canada, 2015–25','Progressive liberalism','high',[-30,0,-70,-50,-40,-60,-20,-30,-40,-90,None],
  'Carbon pricing, cannabis legalization, high immigration targets, the Canada Child Benefit; invoked the Emergencies Act against the 2022 convoy protests.',
  ('Canada','Liberal Party of Canada',[2015,2019],'Liberal Party 2015–19'),'leftist',(0.11,'2016–2019 term'),[]),
 ('Jacinda Ardern','New Zealand, 2017–23','Social democracy','high',[-40,20,-60,-40,-50,-50,-40,-30,-60,-90,None],
  'Banned military-style semi-automatic weapons after Christchurch, pursued strict COVID elimination, set child-poverty and zero-carbon targets.',
  ('New Zealand','Labour Party',[2017],'Labour 2017'),'leftist',None,[]),
 ('Lula da Silva','Brazil, 2003–10, 2023–','Democratic socialism (Workers\' Party)','high',[-60,0,-10,20,10,-30,-40,-20,0,-60,None],
  'Former union leader: Bolsa Família cash transfers, minimum-wage increases, a large public development bank; later convicted on corruption charges that were annulled in 2021.',
  ('Brazil','Workers',[2002,2006],'Workers\' Party 2002–06'),'leftist',(0.25,'2003–2010 term'),[]),
 ('Narendra Modi','India, 2014–','Hindu nationalism','medium',[30,60,60,80,80,70,50,60,60,-10,None],
  'BJP prime minister: demonetization, revoking Kashmir\'s special status, the Citizenship Amendment Act; critics and the V-Dem Institute describe democratic backsliding.',
  None,'rightist',(0.55,'2014–2019 term'),['Jaffrelot, Modi\'s India (2021)']),
 ('Viktor Orbán','Hungary, 1998–2002, 2010–26','National conservatism','high',[20,60,80,90,60,80,10,60,40,-30,None],
  'Self-described "illiberal democracy": a new constitution, control of courts and media, border fence and anti-immigration campaigns, pro-natalist family policy.',
  ('Hungary','Fidesz',[2010,2014,2018],'Fidesz 2010–18'),'leftist',(0.69,'mean of 3 terms: 0.38, 0.88, 0.83'),['Herre codes him leftist on economics, against V-Party\'s center-right coding of Fidesz; the economy score blends both']),
 ('Benjamin Netanyahu','Israel, 1996–99, 2009–21, 2022–','Likud national conservatism','high',[60,50,40,80,50,60,80,60,40,-30,None],
  'Market reforms as finance minister, hawkish on Iran and the Palestinians, the 2018 nation-state law, a judicial overhaul that drew mass protests, and the war in Gaza after October 7, 2023.',
  ('Israel','Likud',[2009,2013,2015,2019],'Likud 2009–19'),'rightist',(0.31,'mean of 5 terms, rising from 0.19 to 0.71'),[]),
 ('Nelson Mandela','South Africa, 1994–99','African nationalist social democracy','high',[-30,-30,-40,0,10,-90,-30,-60,None,-30,None],
  'Co-founded the ANC\'s armed wing in 1961 after peaceful protest was banned; imprisoned 27 years; as president led reconciliation, the Truth and Reconciliation Commission and a liberal constitution.',
  ('South Africa','African National Congress',[1994],'ANC 1994'),'leftist',None,['Mandela, Long Walk to Freedom (1994)']),
 ('Volodymyr Zelensky','Ukraine, 2019–','Centrist populism, wartime nationalism','medium',[20,30,-20,40,-10,-20,60,30,None,-70,None],
  'Comedian elected on an anti-corruption platform; has led Ukraine\'s defense against Russia\'s 2022 invasion, under martial law and with elections postponed.',
  ('Ukraine','Servant',[2019],'Servant of the People 2019'),None,None,[]),
 ('Mikhail Gorbachev','USSR, 1985–91','Reform communism','medium',[-50,0,-10,-40,-60,-30,-60,None,None,-60,None],
  'Glasnost and perestroika, withdrawal from Afghanistan, arms-control treaties; let Eastern Europe go in 1989 without force.',
  None,None,None,['Taubman, Gorbachev: His Life and Times (2017)']),
 ('Javier Milei','Argentina, 2023–','Anarcho-capitalist libertarianism','medium',[95,-40,60,20,30,30,10,50,80,-20,None],
  'Economist elected on cutting the state "with a chainsaw": deep spending cuts, deregulation, devaluation; opposes abortion and calls climate change a socialist lie.',
  None,None,None,['Milei\'s own speeches and program, 2023 campaign']),
]
out=['  // ---- Heads of government and world leaders ----\n']
thatcher=None
for (n,y,l,conf,v,note,pty,herre,g,extra) in L:
    if n=='Margaret Thatcher': continue
    src=[];anc={}
    if herre: src.append(f'Herre (2023), Global Leader Ideologies: coded {herre}')
    if pty:
        c,pat,yrs,lab=pty; pr=party(c,pat,yrs); assert pr, n; anc=anchors(pr, lgbt_ok=min(yrs)>=1990); src.append(vdesc(pr,lab))
    if g: src.append(f'Global Populism Database v2.1 (Hawkins et al.): populism {g[0]:.2f} on a 0–2 scale ({g[1]})')
    src+=extra
    vv=blend(v,anc,herre,g[0] if g else None)
    flag='Economy, immigration, religion and LGBT rights blend the record with V-Party codes for the leader\'s party; the party is not the person.' if anc else None
    out.append(entry(n,'leader',y,l,conf,vv,note,src,flag))
open(S+'/leaders_new.js','w').write(''.join(out))
act=open(S+'/activists_v1.js').read()
act=re.sub(r"v: \[([^\]]*)\]", lambda m: 'v: ['+m.group(1)+', null]', act)
open(S+'/activists_new.js','w').write(act)
print('presidents',len(P),'leaders',len(L)-1)
