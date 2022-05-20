# Agora evaluate

CLI to run selected criterias against result files.

## Usage

Basic example :

```bash
$ yarn start eb_r eb_rsd sp_bb_l1ml #  or npm run start
```

Will run `eb_r`, `eb_rsd`, `sp_bb_l1ml` metric against all results contained in `./data/json/` (initial graphs) and `./data/final/` (final graphs) and will ouptut the result in `./data/` in a csv file.

### Remarks

Final graphs must be named `<name>_<nodes>_<iteration>_<algorithm>.final.json` (ex: `pa_10_2_fta.final.json`) **or** `<name>_<algorithm>.final.json` (ex: `badvoro_fta.final.json`)

Initial graphs must have the same name logic as the given final graphs. If the final graphs are named as `pa_10_2_fta.final.json` there must be an initial graph named `pa_10_2_fta.json`. Of course, if the final graph is named as `badvoro_fta.final.json` there must be an initial graph with the name `badvoro.json`.

## Additional arguments and defaults

```bash
$ yarn start --help #  or npm run start
index.js [criterias..]

evaluate the files with the algorithms

Commandes:
  index.js completion        generate completion script
  index.js [criterias..]     evaluate the files with the algorithms     [défaut]

Positionals:
  criterias  list of criterias to evaluate with
  [défaut: ["eb_r","eb_rsd","eb_rsdd","gs_bb_ar","gs_bb_iar","gs_ch_sd","nm_10nn
  ","nm_11nn","nm_12nn","nm_8nn","nm_9nn","nm_dm_h","nm_dm_imse","nm_dm_me","nm_
  dm_ne","nm_dm_se","nm_mn","oo_ktd","oo_ni","oo_nni","oo_o","sp_bb_a","sp_bb_l1
                                                      ml","sp_bb_na","sp_ch_a"]]

Options:
  --version       Affiche le numéro de version                         [booléen]
  --help          Affiche de l'aide                                    [booléen]
  --initials, -i  List of files containing the initial graphs.
     [tableau] [défaut: files in "./data/json/" with .json extension. Files with
                                              .final.json extension are ignored]
  --finals, -f    List of files containing the final graphs, retrieved from
                  "./data/final/" by default
         [tableau] [défaut: files in "./data/final/" with .final.json extension]
  --output, -o    folder where the evaluation result is saved[défaut: "./data/"]
```
