This Server profile shows a complete install of PingFederate \ PingDirectory \ PingCentral showing User onboarding (Delegated Admin -- Delegator) and Application onboarding (PingCentral).

The Delegator is installed and delivered via PingDirectory.  

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
Use the Ping Delegator app (`https://{{DELEGATOR_PUBLIC_CORS}}:1443/delegator`)

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

PingDirectory can be configured using the PingData console (`https://{{docker host}}:8443/console`)  

* Server: `pingdirectory`
* User: `Administrator`
* Pwd: `2FederateM0re`

## Deployment - Docker Compose
This repo has a configuration for PignCentral that needs to be directly injected into the PC service. 

To deploy these Profiles, do the following:
* On a Docker Compose host, run `git clone https://github.com/cprice-ping/Profile-PingCentral`
* Edit the `./pingcentral/volumes/conf/application.properties` file
** You'll need your Token Issuer (PingFed BaseURL) substituted in `{Your OIDC Issuer}`
* Replace the dummy `./pingcentral/volumes/conf/pingcentral.lic` with a valid one
* Edit the `./env_vars` file to reflect your Docker Compose host information 
* Run `docker-compose up -d`
  * Note: PingCentral will fail due to PF not being up when it starts
* Wait for PingFederate to start up (`docker-compose logs -f pingfederate`)
* Run `docker-compose up -d` to start PingCentral 