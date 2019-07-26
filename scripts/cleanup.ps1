$items = Get-ChildItem C:\apps\conan-bot -Exclude *.sqlite3 -Recurse
Remove-Item $items -Force -Verbose