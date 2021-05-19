# tips-tipper-service

This microservice manages Tippers

TODO:
x add Dynamo table to cloudformation
x add role to cloudformation
x add config
x build auth
x get local creds
x make run time type validation
x try composite key role + phonenumber, see if that works for searching
x Need to have global secondary index
x Update TipperRepo methods for new DB shit
x BAD: Can only fetch tippers due to required next_scheduled_lte
x build GET, PATCH, POST, DELETE routes
xx change phoneNumber field to just be id (it will be the phone nymber for tippers and guid for recipients)
x create PATCH update users route
x create batch PUT and PATCH users methods
-- actually text user during signup / login
xx create get recipients by last tipped (need second gsi)
- fix response type for auth errors (json not plaintext)
- log verbose for performance monitoring
- fix (req as any).thing = stuff
- tighten up logging!
- calculate schedule for dirty users in PUT

Deploying TODO:
x route higher port to port 80
-- update dynamo index to forward schedules
x run with pm2
- need to coordinate pm2 logs with CF daemon config
- URGENT: recursively filter out empty strings from objects before PUTting or PATCHing