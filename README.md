This Server profile shows a complete install of PingFederate \ PingDirectory \ PingCentral showing User onboarding (Delegated Admin -- Delegator) and Application onboarding (PingCentral).

The Delegator is installed and delivered via PingDirectory.  

`https://{{PingDirectory}}:1443/delegator`

PingFed is configured with 2 OAuth clients:
* PingLogon -- used to authenticate a user and issue tokens (AuthZ Code \ Implicit)
* PingIntrospect -- used to validate tokens (PD has a PF Access Token Validator pointing to this client)

A set of PD users are also created and assigned Delegated Administrator roles:

These users are created in `ou=Administrators` to demonstrate separating the Admins from the objects they have rights to.

**Super Administrator**  
`SuperAdmin` \ `2FederateM0re`

This account has the following rights:
* Delegated User Administrator
* Pingfederate Administrator
* PingCentral Administrator

**Application Owner 1**  
`appowner1` \ `2FederateM0re`

This account has the following rights:
* PingCentral AppOwner
* Delegated Admin for BankingUsers Group

This stack can be used as a demo of several Self-Sevice use cases.

Delegated Objects are managed using the PingData console:  

`https://{{PingDataConsole}}:8443/console`

* Server: `pingdirectory`
* User: `Administrator`
* Pwd: `2FederateM0re`

## Deployment - Docker Compose
Environment variables in the `docker-compose.yaml` can be modified to inject the correct locations into this stack

To implement this Use Case, download the `docker-compose.yaml` file and run `docker-compose up -d`

A sample `yaml` file for `localhost` is also provided -- rename `docker-compose-locahost.yaml` to `docker-compose.yaml`

DelAdmin trace logging has been enabled:  
https://support.pingidentity.com/s/document-item?bundleId=pingdirectory-73&topicId=hld1564011489908.html

The logs can be seen with this command:  
`docker-compose exec pingdirectory tail -f /opt/out/instance/logs/debug`
