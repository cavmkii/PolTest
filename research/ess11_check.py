"""ESS round 11: recode items onto the test's political axes (higher = right-hand pole)."""
# Usage: python3 ess11_check.py ESS11e04_2.csv <dir containing axis_check.py> ess11_results.txt
# Data: European Social Survey round 11, edition 4.2 (europeansocialsurvey.org); not redistributed here.
import pandas as pd, numpy as np, sys
sys.path.insert(0, sys.argv[2] if len(sys.argv)>2 else '.')
from axis_check import run
c5=['gincdif','freehms','hmsfmlsh','hmsacld','lrnobed','loylead','wprtbym','wbrgwrm']
c4=['imsmetn','imdfetn','impcntr']
cf=['wsekpwr','weasoff','wexashr']
c10=['imbgeco','imueclt','imwbcnt','euftf','atchctr','atcherp','rlgdgr','ccrdprs','lrscale']
cv=['ipfrulea','ipbhprpa','impsafea','ipstrgva','imptrada','impfreea']
cols=['cntry','anweight','rlgatnd','pray','wrclmch']+c5+c4+cf+c10+cv
d=pd.read_csv(sys.argv[1],usecols=cols,low_memory=False)
for c in c5+cf: d[c]=d[c].where(d[c]<=5)
for c in c4: d[c]=d[c].where(d[c]<=4)
for c in c10: d[c]=d[c].where(d[c]<=10)
for c in cv: d[c]=d[c].where(d[c]<=6)
for c in ['rlgatnd','pray']: d[c]=d[c].where(d[c]<=7)
d['wrclmch']=d.wrclmch.where(d.wrclmch<=5)
inv=lambda s,lo,hi: lo+hi-s
R={}
R['econ_oppose_reduce_income_gaps']=d.gincdif
R['power_obedience_children']=inv(d.lrnobed,1,5)
R['power_loyalty_to_leaders']=inv(d.loylead,1,5)
R['power_value_follow_rules']=inv(d.ipfrulea,1,6)
R['power_value_behave_properly']=inv(d.ipbhprpa,1,6)
R['power_value_strong_government']=inv(d.ipstrgva,1,6)
R['power_value_freedom_low']=d.impfreea
R['culture_gays_not_free']=d.freehms
R['culture_ashamed_gay_family']=inv(d.hmsfmlsh,1,5)
R['culture_no_gay_adoption']=d.hmsacld
R['culture_women_seek_power']=d.wsekpwr
R['culture_women_easily_offended']=d.weasoff
R['culture_women_exaggerate']=d.wexashr
R['culture_women_protected_by_men']=inv(d.wprtbym,1,5)
R['culture_value_tradition']=inv(d.imptrada,1,6)
R['faith_religiosity']=d.rlgdgr
R['faith_attendance']=inv(d.rlgatnd,1,7)
R['faith_prayer']=inv(d.pray,1,7)
R['belong_fewer_same_ethnic']=d.imsmetn
R['belong_fewer_diff_ethnic']=d.imdfetn
R['belong_fewer_poor_countries']=d.impcntr
R['belong_immig_bad_economy']=inv(d.imbgeco,0,10)
R['belong_immig_undermine_culture']=inv(d.imueclt,0,10)
R['belong_immig_worse_place']=inv(d.imwbcnt,0,10)
R['nation_eu_gone_too_far']=inv(d.euftf,0,10)
R['nation_attached_country']=d.atchctr
R['nation_not_attached_europe']=inv(d.atcherp,0,10)
R['ecology_not_worried_climate']=inv(d.wrclmch,1,5)
R['ecology_no_climate_responsibility']=inv(d.ccrdprs,0,10)
X=pd.DataFrame(R)
w=d.anweight.fillna(1).values
print(len(X), d.cntry.nunique())
open(sys.argv[3],'w').write(run(X,w,d.lrscale,'left-right self-placement (lrscale, 0=left..10=right)',d.cntry,'European Social Survey round 11'))
