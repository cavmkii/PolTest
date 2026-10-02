"""ANES 2024 Time Series: recode items onto the test's political axes (higher = right-hand pole)."""
# Usage: python3 anes2024_check.py anes_timeseries_2024_csv_20260519.csv <dir containing axis_check.py> anes2024_results.txt
# Data: ANES 2024 Time Series (electionstudies.org, free registration); not redistributed here.
import pandas as pd, numpy as np, sys
sys.path.insert(0, sys.argv[2] if len(sys.argv)>2 else '.')
from axis_check import run
cols=['V240107b','V241177','V241239','V241245','V241252','V242253x','V242249','V242316a','V242353x','V242411','V242410','V242409',
 'V242260','V242261','V242262','V242263','V241248','V241382','V242364x','V241372x','V241375x','V241420','V241421','V241440',
 'V242227','V241386','V241389x','V241392x','V241395x','V241312x','V241313','V241242','V241306','V242336','V241258','V242324x',
 'V241284x','V241579','V241231','V241233','V241229','V242415','V242414','V241336']
d=pd.read_csv(sys.argv[1],usecols=cols,low_memory=False)
d=d.apply(pd.to_numeric, errors="coerce"); d=d.mask(d<0)
inv=lambda s,lo,hi: lo+hi-s
R={}
R['econ_services_fewer']=inv(d.V241239.where(d.V241239<=7),1,7)
R['econ_private_insurance']=d.V241245.where(d.V241245<=7)
R['econ_jobs_own']=d.V241252.where(d.V241252<=7)
R['econ_oppose_reduce_ineq']=d.V242253x
R['econ_less_regulation']=d.V242249
R['econ_oppose_millionaire_tax']=d.V242316a.map({1:1,3:2,2:3})
R['econ_cut_health_spending']=d.V242353x
R['power_strongleader_bends']=inv(d.V242411,1,5)
R['power_courts_not_check']=d.V242410
R['power_democracy_not_always']=d.V242409
R['power_child_respect']=d.V242260.map({1:0,2:1})
R['power_child_manners']=d.V242261.map({1:0,2:1})
R['power_child_obedience']=d.V242262.map({1:1,2:0})
R['power_child_wellbehaved']=d.V242263.map({1:0,2:1})
R['culture_abortion_restrict']=d.V241248.where(d.V241248<=7)
R['culture_no_gay_marriage']=d.V241382.where(d.V241382<=3)
R['culture_oppose_trans_military']=d.V242364x
R['culture_oppose_trans_bathroom']=d.V241372x
R['culture_ban_trans_sports']=inv(d.V241375x,1,7)
R['faith_religion_important']=inv(d.V241420,1,5)
R['faith_bible_literal']=inv(d.V241421.where(d.V241421<=3),1,3)
R['faith_attendance']=inv(d.V241440.where(d.V241440<=5),1,5)
R['belong_fewer_immigrants']=d.V242227
R['belong_deport_unauthorized']=inv(d.V241386.where(d.V241386<=4),1,4)
R['belong_end_birthright']=inv(d.V241389x,1,7)
R['belong_send_back_dreamers']=inv(d.V241392x,1,6)
R['belong_border_wall']=inv(d.V241395x,1,7)
R['war_not_stay_home']=d.V241312x
R['war_willing_force']=inv(d.V241313,1,5)
R['war_more_defense']=d.V241242.where(d.V241242<=7)
R['justice_death_penalty']=d.V241306.map({1:1,2:0})
R['justice_police_rarely_excessive']=inv(d.V242336,1,5)
R['ecology_regs_burden']=d.V241258.where(d.V241258<=7)
R['ecology_oppose_emissions_regs']=d.V242324x
R['ecology_cut_env_spending']=d.V241284x
R['method_violence_justified']=d.V241579
R['pop_few_big_interests']=d.V241231.map({1:1,2:0})
R['pop_politicians_corrupt']=inv(d.V241233,1,5)
R['pop_distrust_government']=d.V241229
R['pop_referendums']=inv(d.V242415,1,5)
R['pop_against_experts']=d.V242414
R['pop_principles_not_compromise']=d.V241336.map({1:0,2:1})
X=pd.DataFrame(R)
w=d.V240107b.fillna(d.V240107b.median()).values
lr=d.V241177.where(d.V241177<=7)
print(len(X))
open(sys.argv[3],'w').write(run(X,w,lr,'liberal-conservative self-placement (V241177, 1=extremely liberal..7=extremely conservative)',None,'ANES 2024 Time Series'))
