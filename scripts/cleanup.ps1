$ExcludedDirectory = "node_modules|database|auth"
Get-ChildItem C:\apps\conan-bot -Exclude *.sqlite3, config\auth.json -Recurse | Where-Object {$_ -notmatch ${ExcludeDirectory}} | Remove-Item -Force -Verbose -Recurse