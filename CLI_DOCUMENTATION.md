# CLI DOCUMENTATION

| Command  | Required param  | Optional param| Description
| ------------ | ------------ |  ----- | ------------ |
| exit  |   |  | Exit CLI and Kill server |
| man  |   |   | Show available commands  |
| help  |   |   | Alias to "man"  |
| stats  |   |   | Show OS stats and resourse utilization  |
| list users  |   |   | Show all users of the application  |
| more user info  | --{userId}  |   | Show the user info of a particular ID  |
|list checks | | --up or --down | list all the check items created by all users. --up for URLs that are UP, --down for URLs that are down|
| more check info | --{checkID} | | Show the check info of a particular check item |
|list logs| | | Show all the logs of check items. Each file represents the log of individual check item for each day |
|more log info|--{logFileName}||Show the logs in a particular log file

#USAGE:

`more user info --1234567890`

`list checks --up`

`more check info --cft6d7gfle0upwnvu1gy`

`list logs`
