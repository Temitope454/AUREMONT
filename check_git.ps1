$machinePath = (Get-ItemProperty -Path 'Registry::HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment' -Name PATH).Path
$userPath = (Get-ItemProperty -Path 'Registry::HKEY_CURRENT_USER\Environment' -Name PATH -ErrorAction SilentlyContinue).Path
$env:PATH = $machinePath + ';' + $userPath + ';' + $env:PATH
git --version
