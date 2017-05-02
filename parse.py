# Import libraries.
import json, urllib2
import copy
import sys

# Query the API for the particular data.
indicator = sys.argv[1]
print indicator
# dhs_data = r'http://api.dhsprogram.com/rest/dhs/data/HC_HEFF_H_MPH?perpage=300'
# query_data = r'http://api.dhsprogram.com/rest/dhs/data/HC_HEFF_H_MPH?perpage=300'
# data_url = r'http://api.dhsprogram.com/rest/dhs/data/MD,HC_HEFF_H_MPH,MD2013MIS'


query_data = r'http://api.dhsprogram.com/rest/dhs/data/' + indicator + '?returnFields=Indicator,IndicatorID,CountryName,SurveyYear,SurveyID,Value&perpage=300'


# query_data = r'http://api.dhsprogram.com/rest/dhs/data/FE_FRTR_W_GFR?perpage=300'

#Obtain and Parse the list into a Python Object.
req = urllib2.urlopen(query_data)
resp = json.loads(req.read())
dhs = resp['Data']
print json.dumps(dhs, indent=4) #debug

# Copy queried data into GeoJSON file
countries = json.loads(open('countries.geo.parse.json').read())
# print json.dumps(countries, indent=4) #debug
copy = copy.deepcopy(countries)
for country in copy['features']:
    for i in range(2005,2017):
        country['properties'][indicator+str(i)] = 0.0
for result in dhs:
    for country in copy['features']:
        if country['properties']['name'] == result['CountryName']:
            country['properties'][indicator+str(result['SurveyYear'])] = result['Value']
            print "found " + result['CountryName'] + " " + str(result['SurveyYear'])

with open(indicator +'.json', 'w') as f:
    f.write("var " + indicator + "=")
    json.dump(copy, f)

# data = json.loads('HC_HEFF_H_MPH.json')
# print json.dumps(data, indent=4) #debug

#Display a list of each characteristic and their value.
# for c in my_data:
#     print(c['CharacteristicLabel'] + ' : ' + str(c['Value']))
