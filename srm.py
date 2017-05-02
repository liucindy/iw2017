# -*- coding: utf-8 -*-
import csv
import json
import copy

f = open('srmsample.csv', 'rU')
try:
    mvcas = []
    districts = []
    reader = csv.reader(f)
    reader.next() # skip header line
    # build list of unique mvcas
    for row in reader:
        # print row
        cur_mvca = row[4]
        cur_district = row[3]
        if cur_mvca not in mvcas:
            mvcas.append(cur_mvca)
        if cur_district not in districts:
            districts.append(cur_district)
    print mvcas
    print districts
finally:
    f.close()

f = open('srmsample.csv', 'rU')
mauritius_districts = json.loads(open('districts_parse.geo.json').read())
copy = copy.deepcopy(mauritius_districts)
try:
    data_mvca = []
    data_district = []
    reader2 = csv.reader(f)
    reader2.next()
    for mvca in mvcas:
        data_mvca.append({'mvca': mvca, 'mvca_coords': '0, 0', 'num_records': 0, 'totalmonthlyincome': 0, 'fuel_type': 0})
    # for district in districts:
    #     data_district.append({'district': district, 'mvca_coords': '0, 0', 'num_records': 0, 'totalmonthlyincome': 0, 'fuel_type': 0})
    for district in copy['features']:
        district['properties']['num_records'] = 0
        district['properties']['totalmonthlyincome'] = 0
    for row in reader2:
        for record in data_mvca:
            if record['mvca'] == row[4]:
                record['num_records'] = int(record['num_records']) + 1
                record['totalmonthlyincome'] = int(record['totalmonthlyincome']) + int(row[43])
                record['mvca_coords'] = row[5]
                # gather fuel type
                fuel = row[37]
                if fuel in 'Gas':
                    record['fuel_type'] = int(record['fuel_type']) + 1
                elif fuel in 'Kerosene':
                    record['fuel_type'] = int(record['fuel_type']) + 2
                elif fuel in 'Charcoal/Wood':
                    record['fuel_type'] = int(record['fuel_type']) + 3
                else:
                    record['fuel_type'] = int(record['fuel_type']) + 4
        for district in copy['features']:
            if district['properties']['name'] == row[3]:
                district['properties']['num_records'] = int(district['properties']['num_records']) + 1
                district['properties']['totalmonthlyincome'] = int(district['properties']['totalmonthlyincome']) + int(row[43])

    # print json.dumps(data_mvca, indent=4)
    for district in copy['features']:
        district['properties']['avgtotmoninc'] = district['properties']['totalmonthlyincome'] / district['properties']['num_records']
    print json.dumps(copy, indent=4)


finally:
    f.close()

with open('srm.json', 'w') as f:
    f.write("var srm=")
    json.dump(data_mvca, f)

with open('districts.json', 'w') as f:
    f.write("var district_income=")
    json.dump(copy, f)
