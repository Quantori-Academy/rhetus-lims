-- Custom SQL migration file, put you code below! --
UPDATE reagents
SET
	structure = 'OC(=O)CCBr'
WHERE
	NAME = '3-bromopropionic acid, 97%';

UPDATE reagents
SET
	structure = 'OC(=O)CCCBr'
WHERE
	NAME = '4-bromobutyric acid, 97%';

UPDATE reagents
SET
	structure = 'OC(=O)CCCCBr'
WHERE
	NAME = '5-bromovaleric acid, 97%';

UPDATE reagents
SET
	structure = '[O-]C(=O)CCCCCBr'
WHERE
	NAME = '6-bromoyexanoic acid, 98%';

UPDATE reagents
SET
	structure = 'OC(=O)CBr'
WHERE
	NAME = 'Bromoacetic acid ,98%';

UPDATE reagents
SET
	structure = 'Nc1ccc(cc1)C(O)=O'
WHERE
	NAME = '4-aminobenzoic acid, 99%';

UPDATE reagents
SET
	structure = '[Na+].[SH-]'
WHERE
	NAME = 'Sodium hydrogen sulfide monohydrate';

UPDATE reagents
SET
	structure = '[K+].CC([O-])=O'
WHERE
	NAME = 'Acetic acid, potassium salt,97%';

UPDATE reagents
SET
	structure = 'NC(CS)C(O)=O'
WHERE
	NAME = '4-isobutyl-a-methylphenylacetic acid 99%';

UPDATE reagents
SET
	structure = 'OC(=O)C1CCCN1'
WHERE
	NAME = 'L(-)-proline 99%';

UPDATE reagents
SET
	structure = 'O=C1CCC(=O)O1'
WHERE
	NAME = 'Succinic anhydride 99%';

UPDATE reagents
SET
	structure = 'NC(Cc1c[nH]c2ccccc12)C(O)=O'
WHERE
	NAME = 'L-tryptophan 99%';

UPDATE reagents
SET
	structure = 'ON1C(=O)CCC1=O'
WHERE
	NAME = 'N-hydroxysuccinimide,98%';

UPDATE reagents
SET
	structure = 'O=Cc1[nH]cnc1'
WHERE
	NAME = 'Imidazole-4-carbooxaldehyde,97%';

UPDATE reagents
SET
	structure = '[Li+].[O-][I](=O)=O'
WHERE
	NAME = 'Iodic acid, 99%';

UPDATE reagents
SET
	structure = 'S=C(n1ccnc1)n2ccnc2'
WHERE
	NAME = '1.1-thiocarbonyldimidazol,90%';

UPDATE reagents
SET
	structure = 'c1ccc2c(c1)ccc3cccnc23'
WHERE
	NAME = 'Benzo[h]guinoline,98%';

UPDATE reagents
SET
	structure = 'CC(=O)c1ccc(Br)cc1'
WHERE
	NAME = '4-bromoacetophenone,98%';

UPDATE reagents
SET
	structure = 'Brc1ccc(cc1)c2ccccc2'
WHERE
	NAME = '4-bromobiphenyl,98%';

UPDATE reagents
SET
	structure = '[Ag+].[O-][S](=O)(=O)C(F)(F)F'
WHERE
	NAME = 'Silver trifluoromethansulfonate,98%';

UPDATE reagents
SET
	structure = '[Fe++].[cH-]1cccc1.[cH-]2cccc2'
WHERE
	NAME = 'Ferrocene 98%';

UPDATE reagents
SET
	structure = 'c1ccc(cc1)c2ccccn2'
WHERE
	NAME = '2-phenylpyridine,98%';

UPDATE reagents
SET
	structure = 'FC(F)(F)C(=O)CC(=O)c1sccc1'
WHERE
	NAME = '2-thenoyltrifluoroacetone';

UPDATE reagents
SET
	structure = 'Oc1ccc2c(Oc3cc(O)ccc3C24OC(=O)c5cc(ccc45)N=C=S)c1'
WHERE
	NAME = 'Fluorescein isothiocyanate isomer 1';

UPDATE reagents
SET
	structure = 'OC(=O)CCCCC1SCC2NC(=O)NC12'
WHERE
	NAME = 'D-biotin (vitamin h) 99%';

UPDATE reagents
SET
	structure = 'COc1ccc2[C@H]3CC[C@@]4(C)[C@@H](CC[C@@]4(O)C#C)[C@@H]3CCc2c1'
WHERE
	NAME = 'Mestranol';

UPDATE reagents
SET
	structure = 'C[C@]12CC[C@H]3[C@@H](CCc4cc(O)ccc34)[C@@H]1CCC2=O'
WHERE
	NAME = 'Estrone';

UPDATE reagents
SET
	structure = 'O=[I](=O)O[I](=O)=O'
WHERE
	NAME = 'Iodine(5) oxid,98% ';

UPDATE reagents
SET
	structure = 'CC(=O)CC(c1ccccc1)C2=C(O)Oc3ccccc3C2=O'
WHERE
	NAME = 'Warfarin';

UPDATE reagents
SET
	structure = 'CC(C)Cc1ccc(cc1)C(C)C(O)=O'
WHERE
	NAME = 'Ibuprofen,98%';

UPDATE reagents
SET
	structure = 'OC1(CCCCC1)C#C'
WHERE
	NAME = '1-ethynylcyclohexanol';

UPDATE reagents
SET
	structure = 'ClC(Cl)=S'
WHERE
	NAME = 'Thiophosgene';

UPDATE reagents
SET
	structure = '[Cl].Brc1ccncc1'
WHERE
	NAME = '4-bromohyridine hydrochloride,99%';

UPDATE reagents
SET
	structure = 'Sc1ccc(Cl)cc1'
WHERE
	NAME = '4-chlorothiophenol,998%';

UPDATE reagents
SET
	structure = 'COc1ccc(S)cc1'
WHERE
	NAME = '4-methoxybenzenethiol,98%';

UPDATE reagents
SET
	structure = 'O=Cc1ccccn1'
WHERE
	NAME = '2-piridine-carboxaldehyde 99%';

UPDATE reagents
SET
	structure = 'CC(=O)c1ccccn1'
WHERE
	NAME = '2-acetylpyridine,98%';

UPDATE reagents
SET
	structure = 'Brc1ccccn1'
WHERE
	NAME = '2-bromohyridine,99%';

UPDATE reagents
SET
	structure = '[H+].[Cl-].ClCc1ccccn1'
WHERE
	NAME = '2(chloromethyl)pyridine hydrochloride';

UPDATE reagents
SET
	structure = '[Li+].CCC[CH2-]'
WHERE
	NAME = 'N-butyllithium,1,6m in nexane';

UPDATE reagents
SET
	structure = 'C1CCC\C=C/CC1'
WHERE
	NAME = 'Cis-cyclooctene';

UPDATE reagents
SET
	structure = 'CI'
WHERE
	NAME = 'Iodomethane ,99% stabilized';

UPDATE reagents
SET
	structure = 'CC(=O)c1ccccn1'
WHERE
	NAME = '2-acethylpyridine 98%';

UPDATE reagents
SET
	structure = 'CC(C)(C)OC(=O)OC(=O)OC(C)(C)C'
WHERE
	NAME = 'Di-tert-butul dicarbonate,97%';

UPDATE reagents
SET
	structure = 'NCc1ccccn1'
WHERE
	NAME = '2-picolylamine 99%';

UPDATE reagents
SET
	structure = 'CC(C)NC(C)C'
WHERE
	NAME = 'Diisopropylamin';

UPDATE reagents
SET
	structure = '[NH3+][C@H]1CCCC[C@H]1[NH3+]'
WHERE
	NAME = '1,2-diaminocyclohexane';

UPDATE reagents
SET
	structure = 'CC(C)C[Al]CC(C)C'
WHERE
	NAME = 'Diisobutylaluminum hydrid';

UPDATE reagents
SET
	structure = 'CCOCCO'
WHERE
	NAME = '2-ethoxyethanol';

UPDATE reagents
SET
	structure = 'Nc1ccc(cc1)C#C'
WHERE
	NAME = 'U-ethynylaniline 97%';

UPDATE reagents
SET
	structure = 'C#Cc1cccc(c1)C#C'
WHERE
	NAME = '1,3-diethynylbenzene 97%';

UPDATE reagents
SET
	structure = 'O=Cc1ccccn1'
WHERE
	NAME = '2-pyridinecarboxaldehyde';

UPDATE reagents
SET
	structure = 'C(C#N)([2H])([2H])[2H]'
WHERE
	NAME = 'Acetonitrile-d₃ 99,8 atom% d';

UPDATE reagents
SET
	structure = 'BrCCC=C'
WHERE
	NAME = '4-brom-1-buten(1-3) 97%';

UPDATE reagents
SET
	structure = 'BrCCCC=CC=Cn1c2ccccc2c3ccccc13'
WHERE
	NAME = '4-brom-1-penten 95%';

UPDATE reagents
SET
	structure = 'COP(Cl)Cl'
WHERE
	NAME = 'Methyl dichlorphosphite 97%';

UPDATE reagents
SET
	structure = 'O\C(=C/C(=O)C(F)(F)F)C(F)(F)F'
WHERE
	NAME = '1,1,1,5,5,5-hexafluoro-2,4-pentanedione';

UPDATE reagents
SET
	structure = 'C#Cc1cccc(c1)C#C'
WHERE
	NAME = '1,3-diethynylbenzene ';

UPDATE reagents
SET
	structure = 'FC(F)(F)C(=O)CC(=O)c1occc1'
WHERE
	NAME = '4,4,4-trifluoro-1-(2-furyl)-1,3-butanedione 98%';

UPDATE reagents
SET
	structure = 'FC(F)(F)C(=O)CC(=O)c1sccc1'
WHERE
	NAME = 'Thenoylfluoroacetone';

UPDATE reagents
SET
	structure = 'CC(C)(C)C#C'
WHERE
	NAME = '3,3-dimethyl-1-butyne,98%';

UPDATE reagents
SET
	structure = 'COc1ccc(cc1)C#C'
WHERE
	NAME = '4-methoxyphenylacetylene,99%';

UPDATE reagents
SET
	structure = 'C[Si](C)(C)C#C[Si](C)(C)C'
WHERE
	NAME = 'Bis(trimethylsilyl)acetylene';

UPDATE reagents
SET
	structure = '[H+].[Cl-].ClCc1ccncc1'
WHERE
	NAME = '4-(chloromethyl)pyridine hydrocloride';

UPDATE reagents
SET
	structure = 'O=C(C(=O)c1ccccn1)c2ccccn2'
WHERE
	NAME = '2,2-pyridil';

UPDATE reagents
SET
	structure = 'CC(=O)C(C)=O'
WHERE
	NAME = '2,3-butanedione,98%';

UPDATE reagents
SET
	structure = 'CC(C)(C)C1=CC(=O)C(=O)C(=C1)C(C)(C)C'
WHERE
	NAME = '3,5-di-tert-butyl-o-benzoguinone,98%';

UPDATE reagents
SET
	structure = 'NCc1ccccn1'
WHERE
	NAME = '2-(aminomethyl)pyridine,99%';

UPDATE reagents
SET
	structure = 'NC(=S)c1ccccn1'
WHERE
	NAME = 'Pyridine-2-thio-carboxamide,97%';

UPDATE reagents
SET
	structure = 'NC(=O)c1ccccn1'
WHERE
	NAME = 'Pyridine-2-carboxamide,98%';

UPDATE reagents
SET
	structure = 'Clc1ccc(Cl)nn1'
WHERE
	NAME = '3,6-dichloropyridazine,98%';

UPDATE reagents
SET
	structure = 'OB(O)c1ccccc1'
WHERE
	NAME = 'Benzeneboronic acid,98%';

UPDATE reagents
SET
	structure = '[Cl-].Cc1cc(C)c([NH3+])c(C)c1'
WHERE
	NAME = '2,4,6,-trimethylaniline,98%';

UPDATE reagents
SET
	structure = '[Cl-].Cc1cc(C)c([NH3+])c(C)c1'
WHERE
	NAME = '2,4,6-trimethylaniline,97%';

UPDATE reagents
SET
	structure = '[nH]1ccnc1'
WHERE
	NAME = 'Imidazole';

UPDATE reagents
SET
	structure = 'Nc1cccc2cccnc12'
WHERE
	NAME = '8-aminoguinoline';

UPDATE reagents
SET
	structure = 'OCC1CCCCO1'
WHERE
	NAME = '2-(hydroxymethyl)tetrahydropyran';

UPDATE reagents
SET
	structure = 'CC(C)=O'
WHERE
	NAME = 'Acetone, acs reagent, ≥99.5%';

UPDATE reagents
SET
	structure = 'CCO'
WHERE
	NAME = 'Ethanol, pure';

UPDATE reagents
SET
	structure = 'ClCCl'
WHERE
	NAME = 'Dichloromethane, ≥99.8%, contains amylene as stabilizer';

UPDATE reagents
SET
	structure = 'ClC(Cl)Cl'
WHERE
	NAME = 'Trichloromethane, ≥99.9%, contains amylenes as stabilizer';

UPDATE reagents
SET
	structure = 'CO'
WHERE
	NAME = 'Methanol, ≥99.9%, suitable for immunofluorescence';

UPDATE reagents
SET
	structure = 'CCCCCC'
WHERE
	NAME = 'Hexane, ≥98% (gc)';

UPDATE reagents
SET
	structure = 'CCCCCCC'
WHERE
	NAME = 'Heptane';

UPDATE reagents
SET
	structure = 'C1CCOC1'
WHERE
	NAME = 'Tetrahydrofurane, ≥99.9%, suitable for hplc, inhibitor-free';
