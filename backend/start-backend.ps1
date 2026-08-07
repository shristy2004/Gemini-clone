$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith("#")) {
            $pair = $line -split "=", 2
            if ($pair.Length -eq 2) {
                $key = $pair[0].Trim()
                $value = $pair[1].Trim()
                [Environment]::SetEnvironmentVariable($key, $value, "Process")
            }
        }
    }
}

& "$PSScriptRoot\mvnw.cmd" spring-boot:run
