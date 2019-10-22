This Server profile shows a complete install of PingFederate \ PingDirectory \ PingCentral showing User onboarding (Delegated Admin -- Delegator) and Application onboarding (PingCentral).

The Delegator is installed and delivered via PingDirectory.  

`https://{{PingDirectory}}:1443/delegator`

PingFed is configured with 3 OAuth clients that are used for Service logons:
* PingLogon -- used to authenticate a user and issue tokens for Delegator (AuthZ Code \ Implicit)
* PingCentral -- used to authenticate and issue tokens for PingCentral (has an OIDC policy to populate the PC-Role claim)
* PingIntrospect -- used to validate tokens (PD has a PF Access Token Validator pointing to this client)

**Application Templates**
In addition, the following Applications have been added that are designed to be used as templates for applications onboarded using PingCentral:  

* `SAMLConnection1` -- SAML App with Issuance Criteira allowing only members of the `InsuranceUsers` group
* `OIDCclient1` -- OIDC App with Issuance Criteria allowing only members of the `BankingUsers` group  

**Authentication Type**  
An Extended Properties selector has been added to the Policies to allow for the Application Owners to decide what Authentication Type they'd like to use -- this can be configured directly on the application.

The following Types can be added:  
* `Basic` -- Simple HTML Form
* `Enhanced` -- Enhanced HTML Form with LIP (Note -- this is not wired up, just for show)
* `PingID` -- Enhanced HTML Form with PingID  

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

This stack can be used as a demo of several Self-Sevice use cases:

**User Administration**  
Use the Ping Delegator app (`https://{{DELEGATOR_PUBLIC_URL}}:8443/delegator`)

* `superadmin` \ `2FederateM0re` (All objects)
* `useradmin` \ `2FederateM0re`  (User objects)
* `appowner1` \ `2FederateM0re`  (Membership of BankingUsers group)

**Application Administration**
Use the PingCentral app (`https://{{docker host}}:9022`)  

* `superadmin` \ `2FederateM0re` (PC-Role == IAM-Admin)  
* `appowner1` \ `2FederateM0re` (PC-Role == Application-Owner)  

Note: Roles are designated on the `employeeType` attribute of a User in PD (This is exposed as `PingCentral Role` in Delegator)

* `IAM-Admin` -- PingCentral Administrator
* `Application-Owner` -- Application Owner

**PingFed Administrator**
PingFed can be directly managed using the Admin UI (`https://{{docker host}}:9999/pingfederate`)  

* `superadmin` \ `2FederateM0re`  

**PingDirectory Administration**

PingDirectory can be configured using the PingData console (`https://{{PingDataConsole}}:8443/console`)  

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

**PingCentral**  
Clone the `pingcentral` folder and mount the appropriate volumes in `docker-compose.yaml`. These will provide the initial configuration for PingCentral

Replace the dummy `volumes/conf/pingcentral.lic` with a valid one

PingCentral will fail on the initial standing of the stack -- this if for a couple of reasons:
* PingCentral requires that the OIDC Provider (PingFed) is available when it starts up
* PingCentral SSO requires that the OIDC Provider is using a valid SSL certificate

If you're using SSO (this setting is controlled in the `/pingcentral/volume/conf/application.properties` file) you need to add a certificate to PingFed --> Security --> SSL Server and make it active.

The `application.properties` file is injected with a mounted volume -- make sure that the path in `docker-compose.yaml` reflects the local location.

Once the certificate is installed in the OP, and the volume is properly created \ referenced, run `docker compose up -d` to re-introduce PingCentral back into the stack
