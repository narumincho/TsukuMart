$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Client Code And Upload Firebase Server";
Write-Output "Compile Elm ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
elm make ./src/Main.elm --output ./beforeMinifiy.js --optimize;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Compile Elm OK";

$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
uglifyjs ./beforeMinifiy.js -o ./hosting_root/main.js;
Remove-Item ./beforeMinifiy.js;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify JavaScript OK";

Write-Output "Minify CSS ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
cleancss ./style.css -o ./hosting_root/style.css;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Minify CSS OK"

Write-Output "Upload to Firebase ...";
$Host.UI.RawUI.ForegroundColor = "Gray";
firebase deploy --project tsukumart-demo --only hosting;
$Host.UI.RawUI.ForegroundColor = "Yellow";
Write-Output "Upload to Firebase OK";
Write-Output "Complete!";
