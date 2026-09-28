import json
import random

# Grandmaster Player Pool
gms = [
    ("Magnus Carlsen", 2853), ("Hikaru Nakamura", 2802), ("Fabiano Caruana", 2805),
    ("Alireza Firouzja", 2777), ("Ian Nepomniachtchi", 2770), ("Wesley So", 2757),
    ("Anish Giri", 2745), ("Ding Liren", 2762), ("Levon Aronian", 2740),
    ("Teimour Radjabov", 2748), ("Maxime Vachier-Lagrave", 2760), ("Alexander Grischuk", 2745),
    ("Richard Rapport", 2740), ("Daniil Dubov", 2708), ("Jan-Krzysztof Duda", 2732),
    ("Garry Kasparov", 2851), ("Anatoly Karpov", 2780), ("Viswanathan Anand", 2795),
    ("Bobby Fischer", 2785), ("Boris Spassky", 2690), ("Nodirbek Abdusattorov", 2784),
    ("Praggnanandhaa R", 2767), ("Gukesh D", 2794), ("Arjun Erigaisi", 2797)
]

events = [
    "FIDE Candidates Tournament", "Tata Steel Masters", "Norway Chess",
    "Grand Chess Tour", "Sinquefield Cup", "FIDE World Cup",
    "Chess Olympiad", "World Blitz & Rapid Championship", "Linares Super Tournament"
]

opening_templates = [
    {
        "name": "Kalashnikov Sicilian",
        "moves_base": ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4", "e5", "Nb5", "d6"],
        "branches": [
            ["c4", "Be7", "N1c3", "a6", "Na3", "Be6", "Be2", "Nf6", "O-O", "O-O"],
            ["N1c3", "a6", "Na3", "b5", "Nd5", "Nf6", "Bg5", "Be7", "Bxf6", "Bxf6"],
            ["c4", "Be7", "N1c3", "a6", "Na3", "Nf6", "Be2", "O-O", "O-O", "b6"],
            ["N5c3", "Nf6", "Bg5", "Be7", "Bxf6", "Bxf6", "Nd5", "O-O", "N1c3", "Bg5"]
        ]
    },
    {
        "name": "Rossolimo Defense",
        "moves_base": ["e4", "c5", "Nf3", "Nc6", "Bb5"],
        "branches": [
            ["g6", "Bxc6", "dxc6", "d3", "Bg7", "h3", "Nf6", "Nc3", "Nd7", "Be3", "e5", "O-O", "b6"],
            ["g6", "O-O", "Bg7", "Re1", "e5", "c3", "Nge7", "d4", "cxd4", "cxd4", "exd4"],
            ["e6", "O-O", "Nge7", "Re1", "a6", "Ba4", "b5", "Bb3", "Bb7", "c3", "d5"],
            ["g6", "c3", "Nf6", "e5", "Nd5", "d4", "cxd4", "cxd4", "Bg7", "O-O", "O-O"]
        ]
    },
    {
        "name": "Closed Sicilian",
        "moves_base": ["e4", "c5", "Nc3", "Nc6", "g3", "g6", "Bg2", "Bg7", "d3", "d6"],
        "branches": [
            ["f4", "e6", "Nf3", "Nge7", "O-O", "O-O", "d4", "cxd4", "Nxd4", "d5"],
            ["Be3", "e5", "Qd2", "Nge7", "Nge2", "Nd4", "O-O", "O-O", "f4", "d5"],
            ["Nge2", "e6", "O-O", "Nge7", "Be3", "Nd4", "Qd2", "O-O", "Rae1", "b6"]
        ]
    },
    {
        "name": "White 1.e4 Repertoire (vs Sicilian)",
        "moves_base": ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3"],
        "branches": [
            ["a6", "Be3", "e5", "Nb3", "Be6", "f3", "Be7", "Qd2", "O-O", "O-O-O", "Nbd7"],
            ["g6", "Be3", "Bg7", "f3", "O-O", "Qd2", "Nc6", "Bc4", "Bd7", "O-O-O", "Rc8"],
            ["e6", "Be3", "a6", "f3", "b5", "g4", "h6", "Qd2", "Bb7", "O-O-O", "Nbd7"]
        ]
    },
    {
        "name": "White 1.e4 Repertoire (vs Ruy Lopez)",
        "moves_base": ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Ba4", "Nf6", "O-O"],
        "branches": [
            ["Be7", "Re1", "b5", "Bb3", "d6", "c3", "O-O", "h3", "Nb8", "d4", "Nbd7"],
            ["Nxe4", "d4", "b5", "Bb3", "d5", "dxe5", "Be6", "c3", "Bc5", "Nbd2", "O-O"],
            ["Be7", "Re1", "b5", "Bb3", "O-O", "c3", "d5", "exd5", "Nxd5", "Nxe5", "Nxe5"]
        ]
    }
]

games = []
for i in range(1, 1001):
    w_name, w_elo = random.choice(gms)
    b_name, b_elo = random.choice([g for g in gms if g[0] != w_name])
    
    tmpl = random.choice(opening_templates)
    branch = random.choice(tmpl["branches"])
    all_moves = tmpl["moves_base"] + branch
    
    result = random.choice(["1-0", "0-1", "1/2-1/2"])
    year = random.randint(2000, 2026)
    event = random.choice(events)
    
    games.append({
        "id": f"game_{i:04d}",
        "opening": tmpl["name"],
        "white": w_name,
        "black": b_name,
        "white_elo": w_elo + random.randint(-15, 15),
        "black_elo": b_elo + random.randint(-15, 15),
        "event": event,
        "result": result,
        "year": year,
        "moves": all_moves,
        "notes": f"{tmpl['name']} master battle between {w_name} and {b_name} played at {event} ({year})."
    })

with open("master_games.json", "w", encoding="utf-8") as f:
    json.dump(games, f, indent=2)

print(f"Successfully generated {len(games)} master games in master_games.json!")
