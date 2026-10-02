# Recodes WVS Wave 7 items onto the test's political axes (higher = right-hand pole). Writes items.pkl and meta.pkl.
import pandas as pd, numpy as np
from factor_analyzer import FactorAnalyzer
from factor_analyzer.factor_analyzer import calculate_kmo
cols=['B_COUNTRY_ALPHA','S018','W_WEIGHT','Q240','Q17','Q18','Q19','Q21','Q22','Q23','Q26','Q29','Q33','Q34','Q45','Q106','Q107','Q108','Q109','Q111','Q121','Q124','Q126','Q129','Q130','Q150','Q151','Q164','Q169','Q170','Q182','Q184','Q185','Q191','Q192','Q194','Q195','Q235','Q237','Q239','Q241','Q242','Q246','Q247','Q248','Q254','Q257','Q259']
# WVS_Cross-National_Wave_7_csv_v6_0.csv: download from worldvaluessurvey.org (not redistributed here)
d=pd.read_csv('WVS_Cross-National_Wave_7_csv_v6_0.csv',usecols=cols,low_memory=False)
num=d.select_dtypes('number').columns; d[num]=d[num].mask(d[num]<0)
R={}  # recoded: higher = right-hand pole of the axis
inv=lambda s,lo,hi: lo+hi-s
R['econ_Q106_incentives']=d.Q106
R['econ_Q107_private']=inv(d.Q107,1,10)
R['econ_Q108_selfreliance']=d.Q108
R['econ_Q109_competition']=inv(d.Q109,1,10)
R['econ_Q241_taxrich_notessential']=inv(d.Q241,1,10)
R['econ_Q247_equalize_notessential']=inv(d.Q247,1,10)
R['power_Q235_strongleader']=inv(d.Q235,1,4)
R['power_Q237_armyrule']=inv(d.Q237,1,4)
R['power_Q45_respectauthority']=inv(d.Q45,1,3)
R['power_Q17_obedience']=(d.Q17==1).astype(float).where(d.Q17.notna())
R['power_Q150_security']=(d.Q150==2).astype(float).where(d.Q150.isin([1,2]))
R['power_Q248_obeyrulers']=d.Q248
R['power_Q246_civilrights_notess']=inv(d.Q246,1,10)
R['culture_Q182_homosex_unjust']=inv(d.Q182,1,10)
R['culture_Q184_abortion_unjust']=inv(d.Q184,1,10)
R['culture_Q185_divorce_unjust']=inv(d.Q185,1,10)
R['culture_Q29_menleaders']=inv(d.Q29,1,4)
R['culture_Q33_menjobs']=inv(d.Q33,1,5)
R['faith_Q164_god']=d.Q164
R['faith_Q169_religionright']=inv(d.Q169,1,4)
R['faith_Q239_religiouslaw']=inv(d.Q239,1,4)
R['faith_Q242_clericslaw']=d.Q242
R['belong_Q170_onlymyreligion']=inv(d.Q170,1,4)
R['belong_Q19_noneighbor_race']=(d.Q19==1).astype(float).where(d.Q19.notna())
R['belong_Q21_noneighbor_immig']=(d.Q21==1).astype(float).where(d.Q21.notna())
R['belong_Q23_noneighbor_relig']=(d.Q23==1).astype(float).where(d.Q23.notna())
R['belong_Q26_noneighbor_lang']=(d.Q26==1).astype(float).where(d.Q26.notna())
R['belong_Q121_immig_bad']=inv(d.Q121,1,5)
R['belong_Q130_restrict']=d.Q130
R['belong_Q124_crime']=d.Q124
R['belong_Q129_conflict']=d.Q129
R['nation_Q34_natives_first']=inv(d.Q34,1,5)
R['nation_Q254_pride']=inv(d.Q254.where(d.Q254<=4),1,4)
R['nation_Q257_closecountry']=inv(d.Q257,1,4)
R['nation_Q259_notcloseworld']=d.Q259
R['war_Q151_fight']=(d.Q151==1).astype(float).where(d.Q151.isin([1,2]))
R['justice_Q195_deathpenalty']=d.Q195
R['ecology_Q111_growth']=(d.Q111==2).astype(float).where(d.Q111.isin([1,2]))
R['method_Q191_violence']=d.Q191
R['method_Q192_terrorism']=d.Q192
R['method_Q194_polviolence']=d.Q194
X=pd.DataFrame(R)
w=d.S018.fillna(1.0)
ctry=d.B_COUNTRY_ALPHA
lr=d.Q240
X.to_pickle('items.pkl'); pd.DataFrame({'w':w,'c':ctry,'lr':lr}).to_pickle('meta.pkl')
print('N',len(X),'countries',ctry.nunique())
print(X.notna().mean().round(2).sort_values().head(8).to_string())
