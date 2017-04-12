#Import libraries.
import json, urllib2
import copy

#Query the API for the particular data.

dhs_data = r'http://api.dhsprogram.com/rest/dhs/data/HC_HEFF_H_MPH?perpage=300'
# data_url = r'http://api.dhsprogram.com/rest/dhs/data/MD,HC_HEFF_H_MPH,MD2013MIS'
fertility_data = r'http://api.dhsprogram.com/rest/dhs/data/FE_FRTR_W_GFR?perpage=300'
#Obtain and Parse the list into a Python Object.
req = urllib2.urlopen(fertility_data)
resp = json.loads(req.read())
dhs = resp['Data']
print json.dumps(dhs, indent=4)

countries = json.loads(open('countries.json').read())
# print json.dumps(countries, indent=4)
copy = copy.deepcopy(countries)
for result in dhs:
    for country in copy['features']:
        if country['properties']['name'] == result['CountryName'] and result['SurveyYear'] == 2010:
            country['properties']['fertility'] = result['Value']
            print "found " + result['CountryName']

with open('fertility.json', 'w') as f:
     json.dump(copy, f)

#Display a list of each characteristic and their value.
# for c in my_data:
#     print(c['CharacteristicLabel'] + ' : ' + str(c['Value']))
