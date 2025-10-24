# Script to fix case-sensitive import issues
Get-ChildItem -Path "pages\*.tsx" -Recurse | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $content = $content -replace "from '\.\./components/ui/card'", "from '../components/ui/Card'"
    $content = $content -replace "from '\.\./components/ui/button'", "from '../components/ui/Button'"
    $content = $content -replace "from '\.\./components/ui/input'", "from '../components/ui/Input'"
    $content = $content -replace "from '\.\./components/ui/tabs'", "from '../components/ui/tabs'"
    $content = $content -replace "from '\.\./components/ui/badge'", "from '../components/ui/Badge'"
    $content = $content -replace "from '\.\./components/ui/progress'", "from '../components/ui/Progress'"
    Set-Content $_.FullName $content -NoNewline
    Write-Host "Fixed imports in $($_.Name)"
}
