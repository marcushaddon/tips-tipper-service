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
- create PATCH update users route
- create get recipients by last tipped (need second gsi)
- fix response type for auth errors (json not plaintext)
- log verbose for performance monitoring
- fix (req as any).thing = stuff