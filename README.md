# ts-poc-bandmaster
BAND MASTER - an api for bands and musicians

# Routes

## Musician sign up
```
POST /musician/signup
```
sample input
```
{
   "name": "James Heftield",
   "password": "123123",
   "email": "jh@metallica.com",
   "dateOfBirth": "1961-01-01",
   "skills": [
       "rhythm guitar",
       "vocals"
   ]
}
```
sample return
```
result: 201 created
```
Restrictions: only one musician per email


## Musician sign in

```
POST /musician/signin
```
sample input
```
{
   "password": "123123",
   "email": "jh@metallica.com"
}

```
sample return
```

{
   "token": "<auth-token>"
}
```

## Get info about a musician 
### this is an authenticated route

```
GET /musician/12
```
sample output
```
{
   "id": 12,
   "name": "James Hetfield",
   "email": "jh@metallica.com",
   "date_of_birth": "1961-01-01",
   "skills": [
       "rhythm guitar",
       "vocals"
   ]
}
```
Any authenticated musician can view this information
## Create a band
### this is an authenticated route
```
POST /bands/
```
sample input 

```
{
   "name": "Metallica",
   "dateOfFoundation": "1981-10-28",
   "style": "Thrash Metal",
   "city": "Los Angeles"
}
```
The authenticated musician becomes the founder of the band

## Query bands
### this is an authenticated route
```
GET /bands/query
```
sample query 

```
GET /bands/query?city=angeles&style=metal
```

sample output
```
[
    {
        "id": 6,
        "founder": {
            "id": 11,
            "name": "Lars Ulrich",
            "dateOfBirth": "1961-01-02",
            "email": "lu@metallica.com",
            "skills": [
                "drums",
                "producer"
            ]
        },
        "name": "Metallica",
        "dateOfFoundation": "1981-10-28",
        "city": "Los Angeles",
        "style": "Thrash Metal",
        "members": [
            {
                "id": 11,
                "name": "Lars Ulrich",
                "email": "lu@metallica.com",
                "date_of_birth": "1961-01-02",
                "skills": [
                    "drums",
                    "producer"
                ]
            },
            {
                "id": 12,
                "name": "James Hetfield",
                "email": "jh@metallica.com",
                "date_of_birth": "1961-01-01",
                "skills": [
                    "rhythm guitar",
                    "vocals"
                ]
            }
        ]
    },
    {
        "id": 17,
        "founder": {
            "id": 13,
            "name": "Dave Mustaine",
            "dateOfBirth": "1961-01-03",
            "email": "dm@megadeth.com",
            "skills": [
                "rhythm guitar",
                "lead guitar",
                "vocals"
            ]
        },
        "name": "Megadeth",
        "dateOfFoundation": "1983-01-01",
        "city": "Los Angeles",
        "style": "Thrash Metal",
        "members": [
            {
                "id": 13,
                "name": "Dave Mustaine",
                "email": "dm@megadeth.com",
                "date_of_birth": "1961-01-03",
                "skills": [
                    "rhythm guitar",
                    "lead guitar",
                    "vocals"
                ]
            }
        ]
    }
]

```



## Invite a musician to a band
### this is an authenticated route
```
POST /bands/:bandId/invite/:musicianId
```
sample input
```
POST /bands/6/invite/12
```
sample output
```
201 Created
```
sample output when the invited musician is already in the band
```
{
    "message": "James Hetfield is already in Metallica"
}
```
sample output when the invited musician has already been invited to the band (but has not yet accepted the invitation)
```
{
    "message": "Anthony Kiedis has already been invited to Metallica at Thu Apr 06 2023 22:48:57 GMT-0300 (Brasilia Standard Time)"
}
```

## Accept an invitation
### this is an authenticated route

```
POST /musicians/invites/:bandId/accept/
```

sample input
```
POST /musicians/invites/6/accept/

```
sample output
```
201 Created
```

sample output (when user has not been invited to the band)
```
{
    "message": "You have not been invited to this band!"
}
```
## Get pending invitations
### this is an authenticated route


GET /musicians/invites

returns all invitations the musician has received and has not yet accepted

sample output
```
[
    {
        "id": 6,
        "name": "Metallica",
        "invited_at": "2023-04-07T01:48:57.295Z"
    }
]
```