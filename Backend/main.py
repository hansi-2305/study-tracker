# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from typing import Optional, List
# from datetime import datetime, date
# import uuid
# from motor.motor_asyncio import AsyncIOMotorClient

# # ─── CONFIG ───────────────────────────────────────────────────────────────────
# MONGO_URL  = "mongodb://localhost:27017"
# DB_NAME    = "studytracker"

# client     = AsyncIOMotorClient(MONGO_URL)
# db         = client[DB_NAME]
# notes_col  = db["notes"]
# streak_col = db["streak"]

# # ─── APP ──────────────────────────────────────────────────────────────────────
# app = FastAPI(title="Study Tracker API")

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# SECTIONS = ["DSA", "OS", "OOPS", "Computer Networks", "System Design"]

# # ─── SCHEMAS ──────────────────────────────────────────────────────────────────
# class NoteCreate(BaseModel):
#     section: str
#     title:   str
#     content: str
#     tags:    Optional[List[str]] = []

# class NoteUpdate(BaseModel):
#     title:   Optional[str] = None
#     content: Optional[str] = None
#     tags:    Optional[List[str]] = None

# # ─── HELPERS ──────────────────────────────────────────────────────────────────
# def serialize_note(note: dict) -> dict:
#     note["_id"] = str(note["_id"])
#     return note

# def compute_streak(active_dates: list) -> dict:
#     if not active_dates:
#         return {"current": 0, "longest": 0}
#     dates     = sorted(set(active_dates))
#     date_objs = [date.fromisoformat(d) for d in dates]
#     today     = date.today()
#     current   = 0
#     if date_objs and (date_objs[-1] == today or (today - date_objs[-1]).days == 1):
#         current = 1
#         for i in range(len(date_objs) - 2, -1, -1):
#             if (date_objs[i + 1] - date_objs[i]).days == 1:
#                 current += 1
#             else:
#                 break
#         if date_objs[-1] != today:
#             current = current - 1 if current > 1 else 0
#     longest = 1 if date_objs else 0
#     streak  = 1
#     for i in range(1, len(date_objs)):
#         if (date_objs[i] - date_objs[i - 1]).days == 1:
#             streak += 1
#             longest = max(longest, streak)
#         else:
#             streak = 1
#     return {"current": current, "longest": max(longest, current)}

# async def get_streak_doc():
#     streak = await streak_col.find_one({"_id": "singleton"})
#     if not streak:
#         streak = {"_id": "singleton", "active_dates": [], "last_active": None}
#         await streak_col.insert_one(streak)
#     return streak

# # ─── ROUTES ───────────────────────────────────────────────────────────────────
# @app.get("/sections")
# async def get_sections():
#     return {"sections": SECTIONS}

# @app.get("/notes")
# async def get_notes(
#     section: Optional[str] = None,
#     page:    int = 1,
#     limit:   int = 5,
#     search:  Optional[str] = None,
# ):
#     query = {}
#     if section:
#         query["section"] = section
#     if search:
#         query["$or"] = [
#             {"title":   {"$regex": search, "$options": "i"}},
#             {"content": {"$regex": search, "$options": "i"}},
#         ]
#     total  = await notes_col.count_documents(query)
#     cursor = notes_col.find(query).sort("created_at", -1).skip((page - 1) * limit).limit(limit)
#     notes  = [serialize_note(n) async for n in cursor]
#     return {
#         "notes":       notes,
#         "total":       total,
#         "page":        page,
#         "limit":       limit,
#         "total_pages": (total + limit - 1) // limit if total > 0 else 1,
#     }

# @app.get("/notes/{note_id}")
# async def get_note(note_id: str):
#     note = await notes_col.find_one({"_id": note_id})
#     if not note:
#         raise HTTPException(status_code=404, detail="Note not found")
#     return serialize_note(note)

# @app.post("/notes")
# async def create_note(note: NoteCreate):
#     if note.section not in SECTIONS:
#         raise HTTPException(status_code=400, detail="Invalid section")
#     today_str = date.today().isoformat()
#     note_doc  = {
#         "_id":        str(uuid.uuid4()),
#         "section":    note.section,
#         "title":      note.title,
#         "content":    note.content,
#         "tags":       note.tags,
#         "created_at": datetime.now().isoformat(),
#         "updated_at": datetime.now().isoformat(),
#         "date":       today_str,
#     }
#     await notes_col.insert_one(note_doc)
#     streak       = await get_streak_doc()
#     active_dates = list(streak.get("active_dates", []))
#     if today_str not in active_dates:
#         active_dates.append(today_str)
#         await streak_col.update_one(
#             {"_id": "singleton"},
#             {"$set": {"active_dates": active_dates, "last_active": today_str}},
#         )
#     return serialize_note(note_doc)

# @app.put("/notes/{note_id}")
# async def update_note(note_id: str, update: NoteUpdate):
#     note = await notes_col.find_one({"_id": note_id})
#     if not note:
#         raise HTTPException(status_code=404, detail="Note not found")
#     fields = {"updated_at": datetime.now().isoformat()}
#     if update.title   is not None: fields["title"]   = update.title
#     if update.content is not None: fields["content"] = update.content
#     if update.tags    is not None: fields["tags"]    = update.tags
#     await notes_col.update_one({"_id": note_id}, {"$set": fields})
#     updated = await notes_col.find_one({"_id": note_id})
#     return serialize_note(updated)

# @app.delete("/notes/{note_id}")
# async def delete_note(note_id: str):
#     result = await notes_col.delete_one({"_id": note_id})
#     if result.deleted_count == 0:
#         raise HTTPException(status_code=404, detail="Note not found")
#     return {"message": "Note deleted"}

# @app.get("/streak")
# async def get_streak():
#     streak = await get_streak_doc()
#     info   = compute_streak(streak.get("active_dates", []))
#     return {
#         "current":      info["current"],
#         "longest":      info["longest"],
#         "last_active":  streak.get("last_active"),
#         "active_dates": streak.get("active_dates", []),
#     }

# @app.get("/stats")
# async def get_stats():
#     stats = {}
#     for section in SECTIONS:
#         count     = await notes_col.count_documents({"section": section})
#         last_note = await notes_col.find_one({"section": section}, sort=[("created_at", -1)])
#         stats[section] = {
#             "count":        count,
#             "last_updated": last_note["created_at"] if last_note else None,
#         }
#     total  = await notes_col.count_documents({})
#     streak = await get_streak_doc()
#     info   = compute_streak(streak.get("active_dates", []))
#     return {"sections": stats, "total_notes": total, "streak": info}










from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, date, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uuid
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL    = "mongodb://localhost:27017"
DB_NAME      = "studytracker"
SECRET_KEY   = "studytracker_secret_key_change_in_production"
ALGORITHM    = "HS256"
TOKEN_EXPIRE = 30

client     = AsyncIOMotorClient(MONGO_URL)
db         = client[DB_NAME]
notes_col  = db["notes"]
streak_col = db["streak"]
users_col  = db["users"]

pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

app = FastAPI(title="Study Tracker API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

SECTIONS = ["DSA", "OS", "OOPS", "Computer Networks", "System Design"]

class RegisterRequest(BaseModel):
    username: str
    email:    str
    password: str

class NoteCreate(BaseModel):
    section: str
    title:   str
    content: str
    tags:    Optional[List[str]] = []

class NoteUpdate(BaseModel):
    title:   Optional[str] = None
    content: Optional[str] = None
    tags:    Optional[List[str]] = None

def hash_password(p): return pwd_context.hash(p)
def verify_password(plain, hashed): return pwd_context.verify(plain, hashed)

def create_token(data):
    to_encode = data.copy()
    to_encode.update({"exp": datetime.utcnow() + timedelta(days=TOKEN_EXPIRE)})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if not user_id: raise HTTPException(401, "Invalid token")
    except JWTError:
        raise HTTPException(401, "Invalid token")
    user = await users_col.find_one({"_id": user_id})
    if not user: raise HTTPException(401, "User not found")
    return user

def serialize_note(note):
    note["_id"] = str(note["_id"])
    return note

def serialize_user(user):
    return {"_id": str(user["_id"]), "username": user["username"], "email": user["email"], "created_at": user.get("created_at")}

def compute_streak(active_dates):
    if not active_dates: return {"current": 0, "longest": 0}
    dates     = sorted(set(active_dates))
    date_objs = [date.fromisoformat(d) for d in dates]
    today     = date.today()
    current   = 0
    if date_objs and (date_objs[-1] == today or (today - date_objs[-1]).days == 1):
        current = 1
        for i in range(len(date_objs) - 2, -1, -1):
            if (date_objs[i+1] - date_objs[i]).days == 1: current += 1
            else: break
        if date_objs[-1] != today: current = current - 1 if current > 1 else 0
    longest = 1 if date_objs else 0
    streak  = 1
    for i in range(1, len(date_objs)):
        if (date_objs[i] - date_objs[i-1]).days == 1: streak += 1; longest = max(longest, streak)
        else: streak = 1
    return {"current": current, "longest": max(longest, current)}

async def get_streak_doc(user_id):
    streak = await streak_col.find_one({"user_id": user_id})
    if not streak:
        streak = {"_id": str(uuid.uuid4()), "user_id": user_id, "active_dates": [], "last_active": None}
        await streak_col.insert_one(streak)
    return streak

@app.post("/auth/register")
async def register(req: RegisterRequest):
    if len(req.username.strip()) < 3: raise HTTPException(400, "Username must be at least 3 characters")
    if len(req.password) < 6: raise HTTPException(400, "Password must be at least 6 characters")
    existing = await users_col.find_one({"$or": [{"username": req.username}, {"email": req.email}]})
    if existing: raise HTTPException(400, "Username or email already exists")
    user = {"_id": str(uuid.uuid4()), "username": req.username.strip(), "email": req.email.strip().lower(), "password": hash_password(req.password), "created_at": datetime.now().isoformat()}
    await users_col.insert_one(user)
    token = create_token({"sub": user["_id"]})
    return {"token": token, "user": serialize_user(user)}

@app.post("/auth/login")
async def login(form: OAuth2PasswordRequestForm = Depends()):
    user = await users_col.find_one({"$or": [{"username": form.username}, {"email": form.username}]})
    if not user or not verify_password(form.password, user["password"]):
        raise HTTPException(401, "Invalid username or password")
    token = create_token({"sub": user["_id"]})
    return {"access_token": token, "token_type": "bearer", "user": serialize_user(user)}

@app.get("/auth/me")
async def get_me(current_user=Depends(get_current_user)):
    return serialize_user(current_user)

@app.get("/sections")
async def get_sections():
    return {"sections": SECTIONS}

@app.get("/notes")
async def get_notes(section: Optional[str]=None, page: int=1, limit: int=5, search: Optional[str]=None, current_user=Depends(get_current_user)):
    query = {"user_id": current_user["_id"]}
    if section: query["section"] = section
    if search:
        query["$or"] = [{"title": {"$regex": search, "$options": "i"}}, {"content": {"$regex": search, "$options": "i"}}]
    total  = await notes_col.count_documents(query)
    cursor = notes_col.find(query).sort("created_at", -1).skip((page-1)*limit).limit(limit)
    notes  = [serialize_note(n) async for n in cursor]
    return {"notes": notes, "total": total, "page": page, "limit": limit, "total_pages": (total+limit-1)//limit if total > 0 else 1}

@app.get("/notes/{note_id}")
async def get_note(note_id: str, current_user=Depends(get_current_user)):
    note = await notes_col.find_one({"_id": note_id, "user_id": current_user["_id"]})
    if not note: raise HTTPException(404, "Note not found")
    return serialize_note(note)

@app.post("/notes")
async def create_note(note: NoteCreate, current_user=Depends(get_current_user)):
    if note.section not in SECTIONS: raise HTTPException(400, "Invalid section")
    today_str = date.today().isoformat()
    note_doc  = {"_id": str(uuid.uuid4()), "user_id": current_user["_id"], "section": note.section, "title": note.title, "content": note.content, "tags": note.tags, "created_at": datetime.now().isoformat(), "updated_at": datetime.now().isoformat(), "date": today_str}
    await notes_col.insert_one(note_doc)
    streak = await get_streak_doc(current_user["_id"])
    active_dates = list(streak.get("active_dates", []))
    if today_str not in active_dates:
        active_dates.append(today_str)
        await streak_col.update_one({"user_id": current_user["_id"]}, {"$set": {"active_dates": active_dates, "last_active": today_str}})
    return serialize_note(note_doc)

@app.put("/notes/{note_id}")
async def update_note(note_id: str, update: NoteUpdate, current_user=Depends(get_current_user)):
    note = await notes_col.find_one({"_id": note_id, "user_id": current_user["_id"]})
    if not note: raise HTTPException(404, "Note not found")
    fields = {"updated_at": datetime.now().isoformat()}
    if update.title   is not None: fields["title"]   = update.title
    if update.content is not None: fields["content"] = update.content
    if update.tags    is not None: fields["tags"]    = update.tags
    await notes_col.update_one({"_id": note_id}, {"$set": fields})
    return serialize_note(await notes_col.find_one({"_id": note_id}))

@app.delete("/notes/{note_id}")
async def delete_note(note_id: str, current_user=Depends(get_current_user)):
    result = await notes_col.delete_one({"_id": note_id, "user_id": current_user["_id"]})
    if result.deleted_count == 0: raise HTTPException(404, "Note not found")
    return {"message": "Note deleted"}

@app.get("/streak")
async def get_streak(current_user=Depends(get_current_user)):
    streak = await get_streak_doc(current_user["_id"])
    info   = compute_streak(streak.get("active_dates", []))
    return {"current": info["current"], "longest": info["longest"], "last_active": streak.get("last_active"), "active_dates": streak.get("active_dates", [])}

@app.get("/stats")
async def get_stats(current_user=Depends(get_current_user)):
    stats = {}
    for section in SECTIONS:
        count     = await notes_col.count_documents({"section": section, "user_id": current_user["_id"]})
        last_note = await notes_col.find_one({"section": section, "user_id": current_user["_id"]}, sort=[("created_at", -1)])
        stats[section] = {"count": count, "last_updated": last_note["created_at"] if last_note else None}
    total  = await notes_col.count_documents({"user_id": current_user["_id"]})
    streak = await get_streak_doc(current_user["_id"])
    info   = compute_streak(streak.get("active_dates", []))
    return {"sections": stats, "total_notes": total, "streak": info}
