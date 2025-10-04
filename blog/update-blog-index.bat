@echo off
echo Updating BrokerAnalysis Blog Index...
cd /d "C:\Users\LENOVO\Desktop\Brokeranalysisgooglestu\blog"
python generate-blog-index.py
echo Blog index updated successfully!
pause