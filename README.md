# duengerapp
If you want to test it on raspberry you can't do it with raspi's ip because of the license Term from geo.admin.ch
You have to change your ip to a localhost-url
You can do this with changing hosts-File in C:\Windows\System32\drivers\etc but be carefull, bacause this with a default change in this File your computer can be brocken.

1. Add a line on this File with the IP-Adress from raspi and the new url (i.e. localhost.raspitest).
2. In the cmd tipp "ipconfig /flushdns" to clear dns-cache
3. Then clear browsercache

Now you can start the Webapp in your browser with the given url (i.e. localhost.raspitest) (if app is started in the raspi).

For MAC add localhost in /etc/hosts
example: 192.168.xx.xx localhost.duenger
