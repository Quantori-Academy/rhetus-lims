-- Custom SQL migration file, put you code below! --
BEGIN;

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Mercury acetate', '', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ni-al alloy, powder', '', 'kg, plastic box', 0.9, 0.9, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'M-iodomenzoic acid', '', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Benzoic acid', '', 'kg, bottle', 0.5, 0.5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '(oxone monopersulfate)potassium pero-xymonosulfate', '70693-62-8', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '3-bromopropionic acid, 97%', '590-92-1', 'kg, bottle', 0.025, 0.025, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-bromobutyric acid, 97%', '2623-87-2', 'kg, bottle', 0.01, 0.01, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '5-bromovaleric acid, 97%', '2067-33-6', 'kg, bottle', 0.01, 0.01, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '6-bromoyexanoic acid, 98%', '4224-70-8', 'kg, bottle', 0.025, 0.025, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Bromoacetic acid ,98%', '79-08-3', 'kg, bottle', 0.25, 0.25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Top right shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Potassium nitrate', '', 'kg, plastic box', 0.5, 0.5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Potassium nitrite', '', 'kg, plastic box', 0.5, 0.5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Potassium iodide', '', 'kg, plastic box', 0.01, 0.01, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Sodium hydroxide', '', 'kg, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Sodium hydride', '', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Sodium sulphite', '', 'kg, bottle', 0.2, 0.2, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-aminobenzoic acid, 99%', '150-13-0', 'kg, bottle', 0.25, 0.25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Sodium hydrogen sulfide monohydrate', '16721-80-5', 'kg, bottle', 0.25, 0.25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetic acid, potassium salt,97%', '127-08-2', 'kg, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom shelf right');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'L-tyrosine', '', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-isobutyl-a-methylphenylacetic acid 99%', '1568-7-27-1', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'L-histidine hydrochlorid monohydrate', '', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'L-cysteine', '52-90-4', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'L-cysteine hydrochlorid', '', 'kg, bottle', 0.1, 0.1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'L(-)-proline 99%', '147-85-3', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Succinic anhydride 99%', '108-30-5', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'L-tryptophan 99%', '73-22-3', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Bottom left shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Gaddinium(3) nitrate hydrate,99,9%', '942-19-55-3', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'N-hydroxysuccinimide,98%', '6066-82-6', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Iodine', '', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Imidazole-4-carbooxaldehyde,97%', '3034-50-2', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Iodic acid, 99%', '7782-68-5', 'kg, bottle', 0.05, 0.05, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1.1-thiocarbonyldimidazol,90%', '6160-65-2', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Benzo[h]guinoline,98%', '230-27-3', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Sodium dodecyl sulfat', '', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-bromoacetophenone,98%', '99-90-1', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-bromobiphenyl,98%', '92-66-0', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2.6-dinitroanilin', '', 'g, bottle', 3, 3, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,4-dibromobenzene', '', 'g, bottle', 45, 45, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 1, box 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Silver trifluoromethansulfonate,98%', '2923-28-6', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Freezer in refregirator');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrafuoroboric acid dimethyl ether complex', '', 'g, bottle', 50, 50, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Freezer in refregirator');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ferrocene 98%', '102-54-5', 'g, plastic box', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 2, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1-n-butyl-3-methylimidazolium hexafluorophosphate', '174501-64-5', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 2, shelf 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Benzo[h]guinoline,98%', '230-27-3', 'g, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Cabinet 2, shelf 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-phenylpyridine,98%', '1008-89-5', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-thenoyltrifluoroacetone', '326-91-0', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Fluorescein isothiocyanate isomer 1', '3326-32-7', 'mg, bottle', 250, 250, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1-hydroxybenzotriazole hydrate    ', '1233333-53-9', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-methyl-1h-imidazole-carbaidehyde', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'D-biotin (vitamin h) 99%', '58-85-5', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Human serum albumine', '70024-90-7', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Mestranol', '72-33-3', 'g, bottle', 500, 500, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Thallium(1)acetylacetonate', '25955-51-5', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Estrone', '53-16-7', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethynylestradiol-3-methyl ether', '', 'mg, bottle', 500, 500, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Trypsin inhibitor,type l-s from soybean', '9035-131-8', 'mg, bottle', 250, 250, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Iodine(5) oxid,98% ', '12029-98-0', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Warfarin', '81-81-2', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ibuprofen,98%', '15687-27-1', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 2');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1-ethynylcyclohexanol', '78-27-3', 'g, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, door shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Thiophosgene', '463-71-8', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, door shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'P-metoxy bencaldehyde', '', 'ml, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, door shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-bromohyridine hydrochloride,99%', '19524-06-2', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, door shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-chlorothiophenol,998%', '106-54-7', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, door shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dl-dithiothreitol,99% 3483-12-3', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, door shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-methoxybenzenethiol,98%', '696-63-9', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, door shelf');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-piridine-carboxaldehyde 99%', '1121-60-4', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-acetylpyridine,98%', '1122-62-9', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-bromohyridine,99%', '109-04-6', 'ml, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Phenylacetylene', '', 'ml, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2(chloromethyl)pyridine hydrochloride', '6959-47-3', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Warfarin', '81-81-2', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'N-butyllithium,1,6m in nexane', '109-72-8', 'g, bottle', 500, 500, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Cis-cyclooctene', '931-87-3', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Iodomethane ,99% stabilized', '74-88-4', 'g, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-acethylpyridine 98%', '1122-62-9', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Di-tert-butul dicarbonate,97%', '24424-99-5', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-picolylamine 99%', '3731-51-9', 'ml, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 3');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Sulforhodamin b (lc6200)', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 4');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Lambdachome laser dye dcm (lc6500)', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 4');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Coumarin 102 lc4800', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 4');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Coumarin 153 lc5400', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 4');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-(diphenylphosphino)-benzoic acid,97%  ', '2129-31-9', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Refregirator, shelf 4');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Diisopropylamin', '108-18-9', 'ml, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,2-diaminocyclohexane', '694-83-7', 'g, bottle', 250, 250, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurfuryl', '', 'ml, bottle', 500, 500, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,2-dimethoxyethane', '', 'ml, bottle', 500, 500, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Bromobenzene', '', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-pycoline', '', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Diethylamine', '', 'ml, bottle', 900, 900, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Morpholine', '', 'ml, bottle', 200, 200, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Triethylamine', '', 'l, bottle', 0.3, 0.3, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'N-methylmorpholine', '', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Diisobutylaluminum hydrid', '1191-15-7', 'g, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Fumehood 1, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Benzonitrile', '', 'ml, bottle', 300, 300, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Fumehood, right box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,2-dibromoethane', '', 'kg, bottle', 2, 2, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Fumehood, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-methyl-3-butyn-2ol', '', 'ml, bottle', 500, 500, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Fumehood, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-ethoxyethanol', '110-80-5', 'ml, bottle', 500, 500, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Fumehood, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'U-ethynylaniline 97%', '14235-81-5', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,3-diethynylbenzene 97%', '1785-61-1', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Copper(i) trifluomethanesulfonate benzene complex 9%', '42152-46-5', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-pyridinecarboxaldehyde', '1121-60-4', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetonitrile-d₃ 99,8 atom% d', '2206-26-0', 'g, bottle', 50, 50, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-brom-1-buten(1-3) 97%', '5162-44-7', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-brom-1-penten 95%', '1119-51-3', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Poly (9-vinylcarbazole)', '25067-59-8', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'L-prolinol', '', 'ml, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Methyl dichlorphosphite 97%', '3279-26-3', 'ml, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,1,1,5,5,5-hexafluoro-2,4-pentanedione', '1522-22-1', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,3-diethynylbenzene ', '1785-61-1', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,1,1,5,5,5-hexafluoroacetylacetone', '1522-21-1', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4,4,4-trifluoro-1-(2-furyl)-1,3-butanedione 98%', '326-90-9', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '5-heptafluoropentane-2,4-dione', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Thenoylfluoroacetone', '326-91-0', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,1,1,55,6,6,6-octafluoro-2,4-hexanedione', '20825-07-04', 'ml, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Refrigerator 2, freezer');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Diphenylacetylene,99%', '', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,4-dipheylbutadiyne,99%', '', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-ethynyl-n,n-dimethylaniline,97%', '17573-94-3', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-ethynyl-n,n-dimethylaniline,97%', '17573-94-3', 'g, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '1,4-bis(trimethylsilyl)-1,3-butadiyne,98%', '', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Diphenylacetylene,98%', '', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '3,3-dimethyl-1-butyne,98%', '917-92-0', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-methoxyphenylacetylene,99%', '768-60-5', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '(4-fluorophenylethynyl)-trimethylsilane', '130995-12-9', 'ml, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '(triisopropylsilyl)-acetylen,95%', '89343-06-6', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Bis(trimethylsilyl)acetylene', '14630-40-1', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, red box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '4-(chloromethyl)pyridine hydrocloride', '1822-51-1', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2,2-pyridil', '492-73-9', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2,3-butanedione,98%', '431-03-8', 'g, bottle', 10, 10, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '3,5-di-tert-butyl-o-benzoguinone,98%', '3383-21-9', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-(aminomethyl)pyridine,99%', '3731-51-9', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Pyridine-2-thio-carboxamide,97%', '5346-38-3', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Pyridine-2-carboxamide,98%', '1452-77-3', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '3,6-dichloropyridazine,98%', '141-30-0', 'g, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Benzeneboronic acid,98%', '98-80-6', 'g, bottle', 50, 50, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, shelf 1, green box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2,4,6,-trimethylaniline,98%', '88-05-1', 'ml, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2,4,6-trimethylaniline,97%', '88-05-1', 'g, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Refrigirator, left box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'I-methylimidazol', '', 'ml, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Cabinet 1 shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Imidazole', '288-32-4', 'g, bottle', 100, 100, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Cabinet 1 shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '8-aminoguinoline', '578-66-5', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Cabinet 1 shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-(p-tolyl) pyridine', '', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Cabinet 1 shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT '2-(hydroxymethyl)tetrahydropyran', '100-72-1', 'g, bottle', 5, 5, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Cabinet 1 shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrabutilammonium bromid', '', 'g, bottle', 25, 25, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Cabinet 1 shelf 1');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Acetone, acs reagent, ≥99.5%', '67-64-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Ethanol, pure', '64-17-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Dichloromethane, ≥99.8%, contains amylene as stabilizer', '75-09-2', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Trichloromethane, ≥99.9%, contains amylenes as stabilizer', '67-66-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Trichloromethane, ≥99.9%, contains amylenes as stabilizer', '67-66-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Trichloromethane, ≥99.9%, contains amylenes as stabilizer', '67-66-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Trichloromethane, ≥99.9%, contains amylenes as stabilizer', '67-66-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Methanol, ≥99.9%, suitable for immunofluorescence', '67-56-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Methanol, ≥99.9%, suitable for immunofluorescence', '67-56-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Methanol, ≥99.9%, suitable for immunofluorescence', '67-56-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Methanol, ≥99.9%, suitable for immunofluorescence', '67-56-1', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Hexane, ≥98% (gc)', '110-54-3', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Heptane', '142-82-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Heptane', '142-82-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Heptane', '142-82-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Heptane', '142-82-5', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1370' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1374' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

INSERT INTO reagents(name, cas_number, quantity_unit, quantity, quantity_left, expiration_date, storage_id) SELECT 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free', '109-99-9', 'l, bottle', 1, 1, '2025-10-23T00:00:00.000Z', (SELECT id FROM storages WHERE room = 'Room 1376' AND name = 'Solvents box');

COMMIT;
