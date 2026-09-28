import json
import chess

def make_node(board, san, comment="", plans=None, children=None):
    """
    Parses `san` on `board`, verifies it's 100% legal, 
    calculates `from` and `to` square coordinates automatically,
    pushes the move, builds child nodes recursively, and pops move.
    """
    try:
        move = board.parse_san(san.replace("!", "").replace("?", ""))
    except Exception as e:
        raise ValueError(f"ILLEGAL MOVE '{san}' in position FEN: {board.fen()}\nError: {e}")

    from_sq = chess.square_name(move.from_square)
    to_sq = chess.square_name(move.to_square)

    node = {
        "from": from_sq,
        "to": to_sq,
        "san": san,
        "comment": comment
    }
    if plans:
        node["plans"] = plans

    board.push(move)

    if children:
        node["children"] = []
        for child_tuple in children:
            c_san = child_tuple[0]
            c_comm = child_tuple[1] if len(child_tuple) > 1 else ""
            c_plans = child_tuple[2] if len(child_tuple) > 2 else None
            c_children = child_tuple[3] if len(child_tuple) > 3 else None
            
            child_node = make_node(board, c_san, c_comm, c_plans, c_children)
            node["children"].append(child_node)

    board.pop()
    return node

def get_fen_after_moves(moves):
    b = chess.Board()
    for m in moves:
        b.push_san(m)
    return b.fen(), b

# Build trees for all 7 openings
openings = {}

# -------------------------------------------------------------------
# 1. Rossolimo Defense (Black vs 3.Bb5)
# -------------------------------------------------------------------
fen1, board1 = get_fen_after_moves(["e4", "c5", "Nf3", "Nc6", "Bb5"])

rossolimo_tree = {
    "name": "Rossolimo 7-Ply Deep Master Tree",
    "fen": fen1,
    "comment": "Position after 3.Bb5. Play your prepped response (3...g6 or 3...e6). Practice punishing White mistakes!",
    "children": [
        make_node(
            board1, "g6", "3...g6: Fianchetto dark-squared bishop to g7 to dominate the long diagonal.",
            ["Fianchetto Bg7", "Recapture dxc6", "Play e5 central clamp"],
            [
                # White Candidate 1: 4.Bxc6
                ("Bxc6", "White Candidate 1: 4.Bxc6 (Exchange Line). Recapture 4...dxc6!", None, [
                    ("dxc6", "4...dxc6! Opens c8 bishop diagonal for active piece play.", ["Bg4 pin", "Nf6 development"], [
                        ("d3", "5.d3: Solid defense of e4 pawn. Play 5...Bg7!", None, [
                            ("Bg7", "5...Bg7: Fianchetto completed.", None, [
                                ("h3", "6.h3: Slow move. Play 6...Nf6!", None, [("Nf6", "6...Nf6: Develop knight and prepare castling.", None, None)]),
                                ("Nbd2", "6.Nbd2: Developing knight. Play 6...Nf6!", None, [("Nf6", "6...Nf6: Pressure on e4!", None, None)]),
                                ("Be3", "6.Be3: Sub-optimal bishop development! Play 6...Bxb2!", None, [("Bxb2", "6...Bxb2! Tactical strike winning b2 pawn and threatening a1 rook!", None, None)])
                            ])
                        ]),
                        ("O-O", "5.O-O: White castles. Respond with 5...Bg4 pin!", None, [
                            ("Bg4", "5...Bg4: Pin White's f3 knight.", None, [
                                ("h3", "6.h3: Ask bishop question. Play 6...Bxf3!", None, [("Bxf3", "6...Bxf3: Damage White's pawn structure.", None, None)]),
                                ("d3", "6.d3: Solid play. Play 6...Bg7!", None, [("Bg7", "6...Bg7: Prepare Nf6 and O-O.", None, None)])
                            ])
                        ]),
                        ("h3", "5.h3: Sub-optimal slow move! Play 5...e5!", None, [
                            ("e5", "5...e5! Capitalize immediately by taking full central control!", ["Bg7 & Nf6", "Dominate d4"], None)
                        ]),
                        ("Nxe5", "5.Nxe5? Blunder! Poisoned pawn. Capitalize with 5...Qd4!", None, [
                            ("Qd4", "5...Qd4! Capitalize on White's blunder! Double attack on e5 knight and e4 pawn!", None, None)
                        ])
                    ])
                ]),
                # White Candidate 2: 4.O-O
                ("O-O", "White Candidate 2: 4.O-O (Main Line Castling). Play 4...Bg7!", None, [
                    ("Bg7", "4...Bg7: Dark bishop ready for action.", None, [
                        ("Re1", "5.Re1: White defends e4. Play 5...e5!", None, [
                            ("e5", "5...e5! Central clamp preventing d4!", None, [
                                ("c3", "6.c3: Preparing d4 break. Play 6...Nge7!", None, [("Nge7", "6...Nge7: Solid knight development!", None, None)])
                            ])
                        ]),
                        ("c3", "5.c3: White prepares d4. Counter-attack e4 with 5...Nf6!", None, [
                            ("Nf6", "5...Nf6: Direct counter-attack!", None, [
                                ("e5", "6.e5: White advances. Play 6...Nd5!", None, [("Nd5", "6...Nd5: Central knight outpost.", None, None)])
                            ])
                        ]),
                        ("d3", "5.d3: Quiet development. Play 5...Nf6!", None, [
                            ("Nf6", "5...Nf6: Active development.", None, [
                                ("Bg5", "6.Bg5: Pinning knight. Play 6...h6!", None, [("h6", "6...h6: Kick bishop back.", None, None)])
                            ])
                        ])
                    ])
                ]),
                # White Candidate 3: 4.c3
                ("c3", "White Candidate 3: 4.c3 (Center Push). Play 4...Nf6!", None, [
                    ("Nf6", "4...Nf6: Counter-attack White's e4 pawn!", None, [
                        ("e5", "5.e5: Pawn push. Play 5...Nd5!", None, [
                            ("Nd5", "5...Nd5: Outpost knight.", None, [
                                ("d4", "6.d4: White builds full center. Play 6...cxd4!", None, [("cxd4", "6...cxd4: Liquidate central pawns.", None, None)])
                            ])
                        ]),
                        ("d3", "5.d3: Solid defense. Play 5...Bg7!", None, [
                            ("Bg7", "5...Bg7: Fianchetto bishop.", None, [
                                ("O-O", "6.O-O: White castles. Play 6...O-O!", None, [("O-O", "6...O-O: King safety secured.", None, None)])
                            ])
                        ])
                    ])
                ]),
                # White Poor Candidate 4: 4.h3?
                ("h3", "🔴 POOR WHITE MOVE (4.h3?): Passive flank move! Capitalize with 4...e5 or 4...Bg7!", None, [
                    ("e5", "4...e5! Seize the center immediately! White wasted a tempo with h3.", ["Control d4 square", "Develop Bg7 & Nf6"], None)
                ]),
                # White Sub-optimal Candidate 5: 4.Nc3?
                ("Nc3", "⚠️ SUB-OPTIMAL WHITE MOVE (4.Nc3?): Blocks c-pawn! Capitalize with 4...Nd4!", None, [
                    ("Nd4", "4...Nd4! Attack White's b5 bishop with tempo!", None, None)
                ])
            ]
        )
    ]
}

openings["black_rossolimo"] = {
    "id": "black_rossolimo",
    "name": "Rossolimo Defense (vs 3.Bb5)",
    "side": "black",
    "description": "7-Ply Deep Master Tree (Top 3 White Candidate Lines + Sub-optimal White errors to punish!).",
    "eco": "B30",
    "fen": fen1,
    "tree": rossolimo_tree
}

# -------------------------------------------------------------------
# 2. Kalashnikov Sicilian (Black vs 3.d4)
# -------------------------------------------------------------------
fen2, board2 = get_fen_after_moves(["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4", "e5", "Nb5"])

kalashnikov_tree = {
    "name": "Kalashnikov 7-Ply Deep Master Tree",
    "fen": fen2,
    "comment": "Position after 5.Nb5. Play 5...d6 to prevent 6.Nd6+ check!",
    "children": [
        make_node(
            board2, "d6", "5...d6: Essential move! Stops Nd6+ check and controls c5/e5.",
            ["Control c5/e5", "Prepare Be7 & Nf6", "Queenside expansion b5"],
            [
                # White Candidate 1: 6.c4 (Maroczy Bind)
                ("c4", "White Candidate 1: 6.c4 (Maroczy Bind). Respond 6...Be7!", None, [
                    ("Be7", "6...Be7: Prepare knight development to f6.", None, [
                        ("N1c3", "7.N1c3: White solidifies knight placement. Play 7...a6!", None, [
                            ("a6", "7...a6: Kick knight away!", None, [
                                ("Na3", "8.Na3: Knight forced to rim. Play 8...Be6!", None, [
                                    ("Be6", "8...Be6: Prepare ...f5 pawn break!", None, None)
                                ])
                            ])
                        ]),
                        ("g3", "7.g3: White fianchettos. Play 7...Nf6!", None, [
                            ("Nf6", "7...Nf6: Pressure on e4.", None, [
                                ("Bg2", "8.Bg2: Bishop on long diagonal. Play 8...O-O!", None, [
                                    ("O-O", "8...O-O: Kingside safe.", None, None)
                                ])
                            ])
                        ]),
                        ("f3", "7.f3: Passive defense. Capitalize with 7...Nf6!", None, [
                            ("Nf6", "7...Nf6: Develop with tempo!", None, [
                                ("Be3", "8.Be3: Developing bishop. Play 8...O-O!", None, [
                                    ("O-O", "8...O-O: Castle into safety.", None, None)
                                ])
                            ])
                        ])
                    ])
                ]),
                # White Candidate 2: 6.N1c3
                ("N1c3", "White Candidate 2: 6.N1c3 (Direct Development). Play 6...a6!", None, [
                    ("a6", "6...a6: Kick White's b5 knight!", None, [
                        ("Na3", "7.Na3: Knight retreats to side. Play 7...b5!", None, [
                            ("b5", "7...b5! Tactical expansion threatening b4 fork!", None, [
                                ("Nd5", "8.Nd5: White centralized knight. Play 8...Nge7!", None, [
                                    ("Nge7", "8...Nge7: Exchange off dangerous d5 knight!", None, None)
                                ])
                            ])
                        ]),
                        ("Nd5", "7.Nd5: White knight sacrifice / centralization. Play 7...axb5!", None, [
                            ("axb5", "7...axb5! Capture knight!", None, [
                                ("Bxb5", "8.Bxb5: White recaptures. Play 8...Bd7!", None, [
                                    ("Bd7", "8...Bd7: Solid defense unpinning knight!", None, None)
                                ])
                            ])
                        ])
                    ])
                ]),
                # White Candidate 3: 6.N5c3
                ("N5c3", "White Candidate 3: 6.N5c3 (Passive Knight Retreat). Play 6...Nf6!", None, [
                    ("Nf6", "6...Nf6: Rapid piece activation.", None, [
                        ("Bg5", "7.Bg5: Pinning knight. Unpin with 7...Be7!", None, [
                            ("Be7", "7...Be7: Solid unpin.", None, [
                                ("Bxf6", "8.Bxf6: White trades bishop for knight. Recapture 8...Bxf6!", None, [
                                    ("Bxf6", "8...Bxf6: Dark bishop pair advantage!", None, None)
                                ])
                            ])
                        ]),
                        ("f3", "7.f3: Passive move. Play 7...Be7!", None, [
                            ("Be7", "7...Be7: Prepare O-O and d5 break.", None, [
                                ("Be3", "8.Be3: Developing bishop. Play 8...O-O!", None, [
                                    ("O-O", "8...O-O: King in safe haven.", None, None)
                                ])
                            ])
                        ])
                    ])
                ]),
                # White Poor Candidate 4: 6.Bc4?
                ("Bc4", "🔴 POOR WHITE MOVE (6.Bc4?): Bishop is a target! Capitalize with 6...a6!", None, [
                    ("a6", "6...a6! Kick knight to a3, then play 7...b5 winning tempo on Bc4!", None, None)
                ]),
                # White Sub-optimal Candidate 5: 6.Bg5?
                ("Bg5", "⚠️ SUB-OPTIMAL WHITE MOVE (6.Bg5?): Premature pin. Capitalize with 6...a6 7.Na3 b5!", None, [
                    ("a6", "6...a6! Force knight to rim and expand with ...b5!", None, None)
                ])
            ]
        )
    ]
}

openings["black_kalashnikov"] = {
    "id": "black_kalashnikov",
    "name": "Kalashnikov Sicilian",
    "side": "black",
    "description": "7-Ply Deep Kalashnikov Tree (Top 3 White Candidate moves + Sub-optimal White errors).",
    "eco": "B32",
    "fen": fen2,
    "tree": kalashnikov_tree
}

# -------------------------------------------------------------------
# 3. Closed Sicilian (Black vs 2.Nc3)
# -------------------------------------------------------------------
fen3, board3 = get_fen_after_moves(["e4", "c5", "Nc3", "Nc6", "g3", "g6", "Bg2", "Bg7", "d3", "d6"])

closed_tree = {
    "name": "Closed Sicilian 7-Ply Deep Master Tree",
    "fen": fen3,
    "comment": "Position after 5...d6. Learn responses to White's 6th move setups!",
    "children": [
        make_node(
            board3, "Be3", "6.Be3: White prepares Qd2 and Bh6. Respond 6...e5!",
            ["Play e5 central clamp", "Develop Nge7", "Queenside counterplay Rb8 & b5"],
            [
                ("e5", "6...e5! Prevents d4 push and controls d4 square.", None, [
                    ("Qd2", "7.Qd2: White battery setup. Play 7...Nge7!", None, [
                        ("Nge7", "7...Nge7: Develop knight to e7 keeping f7-f5 open.", None, [
                            ("Bh6", "8.Bh6: White offers bishop trade. Play 8...O-O!", None, [
                                ("O-O", "8...O-O: Ignore exchange and castle safely!", None, None)
                            ])
                        ])
                    ]),
                    ("f4", "7.f4: Kingside expansion. Play 7...Nge7!", None, [
                        ("Nge7", "7...Nge7: Solid development.", None, [
                            ("Nf3", "8.Nf3: Knight development. Play 8...O-O!", None, [
                                ("O-O", "8...O-O: Ready for counterplay!", None, None)
                            ])
                        ])
                    ])
                ])
            ]
        ),
        make_node(
            board3, "f4", "6.f4: Grand Prix / Closed attack. Respond 6...e6!", None, [
                ("e6", "6...e6: Prepares Nge7 and d5 break!", None, [
                    ("Nf3", "7.Nf3: Developing knight. Play 7...Nge7!", None, [
                        ("Nge7", "7...Nge7: Flexible setup.", None, [
                            ("O-O", "8.O-O: Castles. Play 8...O-O!", None, [
                                ("O-O", "8...O-O: Prepare d5 break!", None, None)
                            ])
                        ])
                    ])
                ])
            ]
        ),
        make_node(
            board3, "Nge2", "6.Nge2: Flexible knight placement. Respond 6...e5!", None, [
                ("e5", "6...e5: Lock down d4 square!", None, [
                    ("O-O", "7.O-O: White castles. Play 7...Nge7!", None, [
                        ("Nge7", "7...Nge7: Prepare Be6 & O-O.", None, [
                            ("Be3", "8.Be3: Developing bishop. Play 8...O-O!", None, [
                                ("O-O", "8...O-O: Full equality achieved!", None, None)
                            ])
                        ])
                    ])
                ])
            ]
        ),
        make_node(
            board3, "h3", "🔴 POOR WHITE MOVE (6.h3?): Slow passive push! Capitalize with 6...e5!", None, [
                ("e5", "6...e5! Lock the center and prepare ...Nge7 & ...O-O!", None, None)
            ]
        ),
        make_node(
            board3, "a4", "⚠️ SUB-OPTIMAL WHITE MOVE (6.a4?): Irrelevant flank move! Capitalize with 6...e5!", None, [
                ("e5", "6...e5! Claim central dominance!", None, None)
            ]
        )
    ]
}

openings["black_closed"] = {
    "id": "black_closed",
    "name": "Closed Sicilian (vs 2.Nc3)",
    "side": "black",
    "description": "7-Ply Deep Master Tree for Closed Sicilian vs 6.Be3, 6.f4, 6.Nge2, plus White mistakes.",
    "eco": "B23",
    "fen": fen3,
    "tree": closed_tree
}

# -------------------------------------------------------------------
# 4. White Repertoire vs Sicilian (1.e4 c5) -> Rossolimo 3.Bb5
# -------------------------------------------------------------------
fen4, board4 = get_fen_after_moves(["e4", "c5", "Nf3", "Nc6"])

white_sicilian_tree = {
    "name": "White 1.e4 Repertoire vs Sicilian (Rossolimo 3.Bb5)",
    "fen": fen4,
    "comment": "Play 3.Bb5 Rossolimo! Sidesteps heavy theory and inflicts structural damage.",
    "children": [
        make_node(
            board4, "Bb5", "3.Bb5: Rossolimo Attack! Challenge Black's c6 knight immediately.",
            ["Structure damage with Bxc6", "Fast castling O-O", "Central control d3/c3"],
            [
                # Black Candidate 1: 3...g6
                ("g6", "Black Candidate 1: 3...g6 (Fianchetto Line). Play 4.Bxc6!", None, [
                    ("Bxc6", "4.Bxc6: Recapture exchange!", None, [
                        ("dxc6", "4...dxc6: Black recaptures with d-pawn. Play 5.d3!", None, [
                            ("d3", "5.d3: Solid structure protecting e4 pawn. Respond to 5...Bg7 with 6.h3!", None, [
                                ("Bg7", "5...Bg7: Black fianchettos dark bishop. Play 6.h3!", None, [
                                    ("h3", "6.h3: Prevents Bg4 pin and prepares Be3/Nbd2!", None, [
                                        ("Nf6", "6...Nf6: Black develops knight. Play 7.Nbd2!", None, [
                                            ("Nbd2", "7.Nbd2: Prepare Nf1-e3 knight maneuver!", None, None)
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                # Black Candidate 2: 3...e6
                ("e6", "Black Candidate 2: 3...e6 (French Sicilian Line). Play 4.Bxc6!", None, [
                    ("Bxc6", "4.Bxc6: Take on c6 immediately!", None, [
                        ("bxc6", "4...bxc6: Black recaptures with b-pawn. Play 5.d3!", None, [
                            ("d3", "5.d3: Control e4/c4 squares. Respond to 5...Ne7 with 6.O-O!", None, [
                                ("Ne7", "5...Ne7: Black knight development. Play 6.O-O!", None, [
                                    ("O-O", "6.O-O: Castle safely into battle.", None, [
                                        ("Ng6", "6...Ng6: Black knight maneuver. Play 7.e5!", None, [
                                            ("e5", "7.e5! Lock Black's center pawn structure!", None, None)
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                # Black Candidate 3: 3...d6
                ("d6", "Black Candidate 3: 3...d6 (Moscow Transposition). Play 4.O-O!", None, [
                    ("O-O", "4.O-O: Rapid castling!", None, [
                        ("Bd7", "4...Bd7: Black unpins knight. Play 5.Re1!", None, [
                            ("Re1", "5.Re1: Rook to e-file protecting e4.", None, [
                                ("Nf6", "5...Nf6: Black attacks e4. Play 6.c3!", None, [
                                    ("c3", "6.c3: Prepare powerful d4 central break!", None, [
                                        ("a6", "6...a6: Black attacks bishop. Play 7.Bf1!", None, [
                                            ("Bf1", "7.Bf1: Retreat bishop safely keeping long diagonal control!", None, None)
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                # Black Poor Candidate 4: 3...a6?
                ("a6", "🔴 POOR BLACK MOVE (3...a6?): Premature pawn push! Capitalize with 4.Bxc6 dxc6 5.d3!", None, [
                    ("Bxc6", "4.Bxc6! Recapture and play 5.d3 with fast White development!", None, None)
                ]),
                # Black Poor Candidate 5: 3...Nf6?
                ("Nf6", "🔴 POOR BLACK MOVE (3...Nf6?): Loses tempo! Capitalize with 4.e5!", None, [
                    ("e5", "4.e5! Advance pawn attacking f6 knight! 4...Nd5 5.Nc3!", None, None)
                ])
            ]
        )
    ]
}

openings["white_sicilian"] = {
    "id": "white_sicilian",
    "name": "White Repertoire vs Sicilian (3.Bb5)",
    "side": "white",
    "description": "7-Ply Deep White Repertoire vs Sicilian Defense using the aggressive Rossolimo (3.Bb5).",
    "eco": "B30",
    "fen": fen4,
    "tree": white_sicilian_tree
}

# -------------------------------------------------------------------
# 5. White Repertoire vs Open Game (1.e4 e5) -> Ruy Lopez 3.Bb5
# -------------------------------------------------------------------
fen5, board5 = get_fen_after_moves(["e4", "e5", "Nf3", "Nc6"])

white_open_tree = {
    "name": "White Repertoire vs 1...e5 (Ruy Lopez 3.Bb5)",
    "fen": fen5,
    "comment": "Play 3.Bb5 Ruy Lopez! The Spanish Torture for maximum positional pressure.",
    "children": [
        make_node(
            board5, "Bb5", "3.Bb5: The Ruy Lopez (Spanish Opening)! Put pressure on c6 defender.",
            ["Pressure c6 knight", "Castle O-O quickly", "Build d4 center with c3"],
            [
                # Black Candidate 1: 3...a6 (Morphy Defense)
                ("a6", "Black Candidate 1: 3...a6 (Morphy Defense). Play 4.Ba4!", None, [
                    ("Ba4", "4.Ba4: Maintain bishop tension on a4-e8 diagonal!", None, [
                        ("Nf6", "4...Nf6: Black attacks e4. Play 5.O-O!", None, [
                            ("O-O", "5.O-O: Castle! e4 pawn is a poisoned sacrifice (Closed Ruy).", None, [
                                ("Be7", "5...Be7: Main line Closed Ruy. Play 6.Re1!", None, [
                                    ("Re1", "6.Re1: Protect e4 pawn. Respond to 6...b5 with 7.Bb3!", None, [
                                        ("b5", "6...b5: Kicks bishop. Play 7.Bb3!", None, [
                                            ("Bb3", "7.Bb3: Bishop on prime diagonal controlling a2-g8!", None, [
                                                ("d6", "7...d6: Solidifying e5. Play 8.c3!", None, [
                                                    ("c3", "8.c3: Prepare d4 push!", None, None)
                                                ])
                                            ])
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                # Black Candidate 2: 3...Nf6 (Berlin Defense)
                ("Nf6", "Black Candidate 2: 3...Nf6 (Berlin Wall Defense). Play 4.O-O!", None, [
                    ("O-O", "4.O-O: Offer e4 pawn to open e-file!", None, [
                        ("Nxe4", "4...Nxe4: Berlin Accepted. Play 5.d4!", None, [
                            ("d4", "5.d4: Strike immediately in the center!", None, [
                                ("Nd6", "5...Nd6: Black knight retreats. Play 6.Bxc6!", None, [
                                    ("Bxc6", "6.Bxc6: Exchange bishop to ruin Black's pawn structure.", None, [
                                        ("dxc6", "6...dxc6: Recapture. Play 7.dxe5!", None, [
                                            ("dxe5", "7.dxe5: Superior pawn structure in Berlin endgame!", None, None)
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                # Black Poor Candidate 3: 3...d6?
                ("d6", "⚠️ PASSIVE BLACK MOVE (3...d6?): Passive Steinitz Defense! Capitalize with 4.d4!", None, [
                    ("d4", "4.d4! Strike immediately at e5 pawn!", None, None)
                ]),
                # Black Poor Candidate 4: 3...f5?
                ("f5", "🔴 RISKY BLACK GAMBIT (3...f5?): Weakens kingside! Capitalize with 4.Nc3 or 4.d3!", None, [
                    ("Nc3", "4.Nc3! Solidly defend e4 and exploit kingside weaknesses!", None, None)
                ])
            ]
        )
    ]
}

openings["white_open_game"] = {
    "id": "white_open_game",
    "name": "White Repertoire vs Open Game (3.Bb5 Ruy Lopez)",
    "side": "white",
    "description": "7-Ply Deep White Repertoire vs 1...e5 using the Classical Ruy Lopez + Black errors.",
    "eco": "C60",
    "fen": fen5,
    "tree": white_open_tree
}

# -------------------------------------------------------------------
# 6. White Repertoire vs French Defense (1.e4 e6) -> Advance 3.e5
# -------------------------------------------------------------------
fen6, board6 = get_fen_after_moves(["e4", "e6", "d4", "d5"])

white_french_tree = {
    "name": "White Repertoire vs French Defense (Advance 3.e5)",
    "fen": fen6,
    "comment": "Play 3.e5 Advance Variation! Gain spatial advantage and lock Black's c8 bishop.",
    "children": [
        make_node(
            board6, "e5", "3.e5: Advance Variation! Space advantage on kingside.",
            ["Lock c8 bishop", "Hold central d4 pawn with c3", "Kingside attack with Bd3 & Nf3"],
            [
                ("c5", "Black Candidate 1: 3...c5 (Immediate Center Strike). Play 4.c3!", None, [
                    ("c3", "4.c3: Solidify d4 central pawn!", None, [
                        ("Nc6", "4...Nc6: Pressure d4. Play 5.Nf3!", None, [
                            ("Nf3", "5.Nf3: Knight defends d4. Respond to 5...Qb6 with 6.a3!", None, [
                                ("Qb6", "5...Qb6: Black battery targeting b2/d4. Play 6.a3!", None, [
                                    ("a3", "6.a3: Prepare b4 expansion!", None, [
                                        ("c4", "6...c4: Black locks queenside. Play 7.Nbd2!", None, [
                                            ("Nbd2", "7.Nbd2: Prepare b3 break to open queenside lines!", None, None)
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                ("f6", "🔴 POOR BLACK MOVE (3...f6?): Weakens e8-h5 diagonal! Capitalize with 4.exf6 Nxf6 5.Nf3!", None, [
                    ("exf6", "4.exf6! Recapture and target Black's weakened kingside!", None, None)
                ]),
                ("Ne7", "⚠️ PASSIVE BLACK MOVE (3...Ne7?): Passive placement! Capitalize with 4.c3 & 5.Nf3!", None, [
                    ("c3", "4.c3! Build an impregnable central pawn chain!", None, None)
                ])
            ]
        )
    ]
}

openings["white_french"] = {
    "id": "white_french",
    "name": "White Repertoire vs French Defense (3.e5)",
    "side": "white",
    "description": "7-Ply Deep White Repertoire vs French Defense with 3.e5 Advance Variation.",
    "eco": "C02",
    "fen": fen6,
    "tree": white_french_tree
}

# -------------------------------------------------------------------
# 7. White Repertoire vs Caro-Kann Defense (1.e4 c6) -> Advance 3.e5
# -------------------------------------------------------------------
fen7, board7 = get_fen_after_moves(["e4", "c6", "d4", "d5"])

white_caro_tree = {
    "name": "White Repertoire vs Caro-Kann Defense (Advance 3.e5)",
    "fen": fen7,
    "comment": "Play 3.e5 Advance Variation! Restrict Black's piece mobility.",
    "children": [
        make_node(
            board7, "e5", "3.e5: Advance Variation! Space wedge in Black's territory.",
            ["Develop Nf3 & Bd3", "Target Black's f5 bishop", "Kingside initiative"],
            [
                ("Bf5", "Black Candidate 1: 3...Bf5 (Main Line Bishop Out). Play 4.Nf3!", None, [
                    ("Nf3", "4.Nf3: Natural development. Respond to 4...e6 with 5.Be2!", None, [
                        ("e6", "4...e6: Black solidifies center. Play 5.Be2!", None, [
                            ("Be2", "5.Be2: Flexible quiet development. Prepare O-O!", None, [
                                ("c5", "5...c5: Black attacks d4. Play 6.Be3!", None, [
                                    ("Be3", "6.Be3: Counter-defend d4!", None, [
                                        ("cxd4", "6...cxd4: Black trades pawns. Play 7.Nxd4!", None, [
                                            ("Nxd4", "7.Nxd4: Recapture with knight and attack f5 bishop!", None, None)
                                        ])
                                    ])
                                ])
                            ])
                        ])
                    ])
                ]),
                ("c5", "⚠️ SUB-OPTIMAL BLACK MOVE (3...c5?): Plays c5 before bishop out! Capitalize with 4.dxc5!", None, [
                    ("dxc5", "4.dxc5! Win pawn and force Black to spend tempos!", None, None)
                ]),
                ("e6", "🔴 POOR BLACK MOVE (3...e6?): Traps light-squared bishop! Capitalize with 4.Nf3 & 5.Bd3!", None, [
                    ("Nf3", "4.Nf3! Lock Black's bad bishop on c8!", None, None)
                ])
            ]
        )
    ]
}

openings["white_caro"] = {
    "id": "white_caro",
    "name": "White Repertoire vs Caro-Kann (3.e5)",
    "side": "white",
    "description": "7-Ply Deep White Repertoire vs Caro-Kann Defense using 3.e5 Advance Variation.",
    "eco": "B12",
    "fen": fen7,
    "tree": white_caro_tree
}

# Output file openings_data.js
js_output = f"// Comprehensive 7-Ply Deep Master Repertoire Trees (100% Verified Legal Moves via python-chess)\nconst OPENINGS_DATA = {json.dumps(openings, indent=4)};\n"

with open("openings_data.js", "w", encoding="utf-8") as f:
    f.write(js_output)

print("SUCCESSFULLY VALIDATED & GENERATED ENHANCED OPENINGS DATA WITH SUB-OPTIMAL LINES IN openings_data.js!")
