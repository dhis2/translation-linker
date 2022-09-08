#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""

@author: philld
"""

import os
import json
from transifex.api import transifex_api

print(os.getenv("PWD"))

transifex_api.setup(auth=os.getenv("TX_TOKEN"))

organization = transifex_api.Organization.get(slug="hisp-uio")
projects = organization.fetch('projects')

langs = set([])
tr = {}
lang_stats = {}
lang_statsall = {}
word_stats = {}
projmap = {}
versions = ("33","34","35","36","37","38","master")

ft = open('data/feature-toggling.json',)
togglers = json.load(ft)
ft.close()

langmap = {}
for l in transifex_api.Language.all():
    langmap[l.code] = l.name



for p in projects:
    if p.name[0:4] in ("APP:","APP-"):
        
        projmap[p.name] = p.slug
        
        print(p.name)
        
        resources = p.fetch('resources')
        
        for r in resources:
            # print('\t',r["name"], "[", r["slug"],"]")
            
            r_slug = r.attributes['slug']

            base_version = r_slug.split('--')[0].replace('2-','').lstrip('v').replace('-x','')
            # print(r["slug"],' ---> ',version)

            version_list = [base_version]
            if base_version in ['master','dev']:
                if p.homepage_url in togglers:
                    version_list += togglers[p.homepage_url] 

            for version in version_list:

                if version in versions:
                    
                    if version not in lang_stats:
                        lang_stats[version] = {}
                        lang_statsall[version] = {}
        
                                    
                    for s in transifex_api.ResourceLanguageStats.filter(project=p, resource=r):   
                        
                        language = s.language.id.split(':')[1]
                        
                        trans = s.attributes['translated_strings']
                        tot = s.attributes['total_strings']
                        
                        if language in lang_stats[version]:
                            lang_stats[version][language] = lang_stats[version][language] + s.attributes['translated_strings']
                        else:
                            lang_stats[version][language] = s.attributes['translated_strings']
                                            
                            
                        if p.name not in lang_statsall[version]:
                            lang_statsall[version][p.name] = {}
                            
                        if r_slug not in lang_statsall[version][p.name]:
                            lang_statsall[version][p.name][r_slug] = {}
                            
                        if tot == 0:
                            lang_statsall[version][p.name][r_slug][language] = "0%"
                        else:
                            lang_statsall[version][p.name][r_slug][language] = f"{trans/tot:.1%}"




mylangs = lang_stats["master"]
lango = {}

for l in mylangs:
    name = langmap[l]
    lango[l] = name
    
mysortedLangs = {k: v for k, v in sorted(mylangs.items(), key=lambda item: item[1],reverse=True)}
langos = {k: v for k, v in sorted(lango.items(), key=lambda item: item[1],reverse=False)}

stats = {"versions": versions, "overview" : lang_stats,"details":lang_statsall,"languages": langos, "projects":projmap }
         

f = open("./data/transifex.json","w")
f.write("transifex = "+json.dumps(stats,indent=2)+";")
f.close()









