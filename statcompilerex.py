#Import libraries.
import json, urllib2

#Query the API for the particular data.

data_url = r'http://api.dhsprogram.com/rest/dhs/data/MD,HC_HEFF_H_MPH,MD2013MIS'


#Obtain and Parse the list into a Python Object.
req = urllib2.urlopen(data_url)
resp = json.loads(req.read())
my_data = resp['Data']
print json.dumps(resp, indent=4)

#Display a list of each characteristic and their value.
for c in my_data:
    print(c['CharacteristicLabel'] + ' : ' + str(c['Value']))
