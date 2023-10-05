1. User logs in
    - Save session in DB
        - DB session should have long expiry, 30 days?
    - Save session in cookies
        - Cookie session should have short expiry, 60 seconds?
2. Create a poller on the front end to refresh the cookie session every 50 seconds
    - Ping API every ~50 seconds to verify DB session hasn't been revoked
        - If DB session is valid:
            - Refresh cookie session for another 50 seconds
        - If DB session is invalid:
            - Revoke cookie session
3. When user leaves the site
    - Polling stops
    - When the user returns to the site, the session ID should still be able to look
        up the session and verify that the DB session is valid
        - Cookie session reinitiates
        - loop continues

-- Other Options --
Instead of pinging API every 50 seconds,
    when user hits an API endpoint, check if
    Cookie session is still valid, if not, revalidate it