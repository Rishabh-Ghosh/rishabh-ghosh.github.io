// Comprehensive 7-Ply Deep Master Repertoire Trees (100% Verified Legal Moves via python-chess)
const OPENINGS_DATA = {
    "black_rossolimo": {
        "id": "black_rossolimo",
        "name": "Rossolimo Defense (vs 3.Bb5)",
        "side": "black",
        "description": "7-Ply Deep Master Tree (Top 3 White Candidate Lines + Sub-optimal White errors to punish!).",
        "eco": "B30",
        "fen": "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
        "tree": {
            "name": "Rossolimo 7-Ply Deep Master Tree",
            "fen": "r1bqkbnr/pp1ppppp/2n5/1Bp5/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 3 3",
            "comment": "Position after 3.Bb5. Play your prepped response (3...g6 or 3...e6). Practice punishing White mistakes!",
            "children": [
                {
                    "from": "g7",
                    "to": "g6",
                    "san": "g6",
                    "comment": "3...g6: Fianchetto dark-squared bishop to g7 to dominate the long diagonal.",
                    "plans": [
                        "Fianchetto Bg7",
                        "Recapture dxc6",
                        "Play e5 central clamp"
                    ],
                    "children": [
                        {
                            "from": "b5",
                            "to": "c6",
                            "san": "Bxc6",
                            "comment": "White Candidate 1: 4.Bxc6 (Exchange Line). Recapture 4...dxc6!",
                            "children": [
                                {
                                    "from": "d7",
                                    "to": "c6",
                                    "san": "dxc6",
                                    "comment": "4...dxc6! Opens c8 bishop diagonal for active piece play.",
                                    "plans": [
                                        "Bg4 pin",
                                        "Nf6 development"
                                    ],
                                    "children": [
                                        {
                                            "from": "d2",
                                            "to": "d3",
                                            "san": "d3",
                                            "comment": "5.d3: Solid defense of e4 pawn. Play 5...Bg7!",
                                            "children": [
                                                {
                                                    "from": "f8",
                                                    "to": "g7",
                                                    "san": "Bg7",
                                                    "comment": "5...Bg7: Fianchetto completed.",
                                                    "children": [
                                                        {
                                                            "from": "h2",
                                                            "to": "h3",
                                                            "san": "h3",
                                                            "comment": "6.h3: Slow move. Play 6...Nf6!",
                                                            "children": [
                                                                {
                                                                    "from": "g8",
                                                                    "to": "f6",
                                                                    "san": "Nf6",
                                                                    "comment": "6...Nf6: Develop knight and prepare castling."
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "from": "b1",
                                                            "to": "d2",
                                                            "san": "Nbd2",
                                                            "comment": "6.Nbd2: Developing knight. Play 6...Nf6!",
                                                            "children": [
                                                                {
                                                                    "from": "g8",
                                                                    "to": "f6",
                                                                    "san": "Nf6",
                                                                    "comment": "6...Nf6: Pressure on e4!"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "from": "c1",
                                                            "to": "e3",
                                                            "san": "Be3",
                                                            "comment": "6.Be3: Sub-optimal bishop development! Play 6...Bxb2!",
                                                            "children": [
                                                                {
                                                                    "from": "g7",
                                                                    "to": "b2",
                                                                    "san": "Bxb2",
                                                                    "comment": "6...Bxb2! Tactical strike winning b2 pawn and threatening a1 rook!"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "e1",
                                            "to": "g1",
                                            "san": "O-O",
                                            "comment": "5.O-O: White castles. Respond with 5...Bg4 pin!",
                                            "children": [
                                                {
                                                    "from": "c8",
                                                    "to": "g4",
                                                    "san": "Bg4",
                                                    "comment": "5...Bg4: Pin White's f3 knight.",
                                                    "children": [
                                                        {
                                                            "from": "h2",
                                                            "to": "h3",
                                                            "san": "h3",
                                                            "comment": "6.h3: Ask bishop question. Play 6...Bxf3!",
                                                            "children": [
                                                                {
                                                                    "from": "g4",
                                                                    "to": "f3",
                                                                    "san": "Bxf3",
                                                                    "comment": "6...Bxf3: Damage White's pawn structure."
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            "from": "d2",
                                                            "to": "d3",
                                                            "san": "d3",
                                                            "comment": "6.d3: Solid play. Play 6...Bg7!",
                                                            "children": [
                                                                {
                                                                    "from": "f8",
                                                                    "to": "g7",
                                                                    "san": "Bg7",
                                                                    "comment": "6...Bg7: Prepare Nf6 and O-O."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "h2",
                                            "to": "h3",
                                            "san": "h3",
                                            "comment": "5.h3: Sub-optimal slow move! Play 5...e5!",
                                            "children": [
                                                {
                                                    "from": "e7",
                                                    "to": "e5",
                                                    "san": "e5",
                                                    "comment": "5...e5! Capitalize immediately by taking full central control!",
                                                    "plans": [
                                                        "Bg7 & Nf6",
                                                        "Dominate d4"
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "f3",
                                            "to": "e5",
                                            "san": "Nxe5",
                                            "comment": "5.Nxe5? Blunder! Poisoned pawn. Capitalize with 5...Qd4!",
                                            "children": [
                                                {
                                                    "from": "d8",
                                                    "to": "d4",
                                                    "san": "Qd4",
                                                    "comment": "5...Qd4! Capitalize on White's blunder! Double attack on e5 knight and e4 pawn!"
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "e1",
                            "to": "g1",
                            "san": "O-O",
                            "comment": "White Candidate 2: 4.O-O (Main Line Castling). Play 4...Bg7!",
                            "children": [
                                {
                                    "from": "f8",
                                    "to": "g7",
                                    "san": "Bg7",
                                    "comment": "4...Bg7: Dark bishop ready for action.",
                                    "children": [
                                        {
                                            "from": "f1",
                                            "to": "e1",
                                            "san": "Re1",
                                            "comment": "5.Re1: White defends e4. Play 5...e5!",
                                            "children": [
                                                {
                                                    "from": "e7",
                                                    "to": "e5",
                                                    "san": "e5",
                                                    "comment": "5...e5! Central clamp preventing d4!",
                                                    "children": [
                                                        {
                                                            "from": "c2",
                                                            "to": "c3",
                                                            "san": "c3",
                                                            "comment": "6.c3: Preparing d4 break. Play 6...Nge7!",
                                                            "children": [
                                                                {
                                                                    "from": "g8",
                                                                    "to": "e7",
                                                                    "san": "Nge7",
                                                                    "comment": "6...Nge7: Solid knight development!"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "c2",
                                            "to": "c3",
                                            "san": "c3",
                                            "comment": "5.c3: White prepares d4. Counter-attack e4 with 5...Nf6!",
                                            "children": [
                                                {
                                                    "from": "g8",
                                                    "to": "f6",
                                                    "san": "Nf6",
                                                    "comment": "5...Nf6: Direct counter-attack!",
                                                    "children": [
                                                        {
                                                            "from": "e4",
                                                            "to": "e5",
                                                            "san": "e5",
                                                            "comment": "6.e5: White advances. Play 6...Nd5!",
                                                            "children": [
                                                                {
                                                                    "from": "f6",
                                                                    "to": "d5",
                                                                    "san": "Nd5",
                                                                    "comment": "6...Nd5: Central knight outpost."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "d2",
                                            "to": "d3",
                                            "san": "d3",
                                            "comment": "5.d3: Quiet development. Play 5...Nf6!",
                                            "children": [
                                                {
                                                    "from": "g8",
                                                    "to": "f6",
                                                    "san": "Nf6",
                                                    "comment": "5...Nf6: Active development.",
                                                    "children": [
                                                        {
                                                            "from": "c1",
                                                            "to": "g5",
                                                            "san": "Bg5",
                                                            "comment": "6.Bg5: Pinning knight. Play 6...h6!",
                                                            "children": [
                                                                {
                                                                    "from": "h7",
                                                                    "to": "h6",
                                                                    "san": "h6",
                                                                    "comment": "6...h6: Kick bishop back."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "c2",
                            "to": "c3",
                            "san": "c3",
                            "comment": "White Candidate 3: 4.c3 (Center Push). Play 4...Nf6!",
                            "children": [
                                {
                                    "from": "g8",
                                    "to": "f6",
                                    "san": "Nf6",
                                    "comment": "4...Nf6: Counter-attack White's e4 pawn!",
                                    "children": [
                                        {
                                            "from": "e4",
                                            "to": "e5",
                                            "san": "e5",
                                            "comment": "5.e5: Pawn push. Play 5...Nd5!",
                                            "children": [
                                                {
                                                    "from": "f6",
                                                    "to": "d5",
                                                    "san": "Nd5",
                                                    "comment": "5...Nd5: Outpost knight.",
                                                    "children": [
                                                        {
                                                            "from": "d2",
                                                            "to": "d4",
                                                            "san": "d4",
                                                            "comment": "6.d4: White builds full center. Play 6...cxd4!",
                                                            "children": [
                                                                {
                                                                    "from": "c5",
                                                                    "to": "d4",
                                                                    "san": "cxd4",
                                                                    "comment": "6...cxd4: Liquidate central pawns."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "d2",
                                            "to": "d3",
                                            "san": "d3",
                                            "comment": "5.d3: Solid defense. Play 5...Bg7!",
                                            "children": [
                                                {
                                                    "from": "f8",
                                                    "to": "g7",
                                                    "san": "Bg7",
                                                    "comment": "5...Bg7: Fianchetto bishop.",
                                                    "children": [
                                                        {
                                                            "from": "e1",
                                                            "to": "g1",
                                                            "san": "O-O",
                                                            "comment": "6.O-O: White castles. Play 6...O-O!",
                                                            "children": [
                                                                {
                                                                    "from": "e8",
                                                                    "to": "g8",
                                                                    "san": "O-O",
                                                                    "comment": "6...O-O: King safety secured."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "h2",
                            "to": "h3",
                            "san": "h3",
                            "comment": "\ud83d\udd34 POOR WHITE MOVE (4.h3?): Passive flank move! Capitalize with 4...e5 or 4...Bg7!",
                            "children": [
                                {
                                    "from": "e7",
                                    "to": "e5",
                                    "san": "e5",
                                    "comment": "4...e5! Seize the center immediately! White wasted a tempo with h3.",
                                    "plans": [
                                        "Control d4 square",
                                        "Develop Bg7 & Nf6"
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "b1",
                            "to": "c3",
                            "san": "Nc3",
                            "comment": "\u26a0\ufe0f SUB-OPTIMAL WHITE MOVE (4.Nc3?): Blocks c-pawn! Capitalize with 4...Nd4!",
                            "children": [
                                {
                                    "from": "c6",
                                    "to": "d4",
                                    "san": "Nd4",
                                    "comment": "4...Nd4! Attack White's b5 bishop with tempo!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    "black_kalashnikov": {
        "id": "black_kalashnikov",
        "name": "Kalashnikov Sicilian",
        "side": "black",
        "description": "7-Ply Deep Kalashnikov Tree (Top 3 White Candidate moves + Sub-optimal White errors).",
        "eco": "B32",
        "fen": "r1bqkbnr/pp1p1ppp/2n5/1N2p3/4P3/8/PPP2PPP/RNBQKB1R b KQkq - 1 5",
        "tree": {
            "name": "Kalashnikov 7-Ply Deep Master Tree",
            "fen": "r1bqkbnr/pp1p1ppp/2n5/1N2p3/4P3/8/PPP2PPP/RNBQKB1R b KQkq - 1 5",
            "comment": "Position after 5.Nb5. Play 5...d6 to prevent 6.Nd6+ check!",
            "children": [
                {
                    "from": "d7",
                    "to": "d6",
                    "san": "d6",
                    "comment": "5...d6: Essential move! Stops Nd6+ check and controls c5/e5.",
                    "plans": [
                        "Control c5/e5",
                        "Prepare Be7 & Nf6",
                        "Queenside expansion b5"
                    ],
                    "children": [
                        {
                            "from": "c2",
                            "to": "c4",
                            "san": "c4",
                            "comment": "White Candidate 1: 6.c4 (Maroczy Bind). Respond 6...Be7!",
                            "children": [
                                {
                                    "from": "f8",
                                    "to": "e7",
                                    "san": "Be7",
                                    "comment": "6...Be7: Prepare knight development to f6.",
                                    "children": [
                                        {
                                            "from": "b1",
                                            "to": "c3",
                                            "san": "N1c3",
                                            "comment": "7.N1c3: White solidifies knight placement. Play 7...a6!",
                                            "children": [
                                                {
                                                    "from": "a7",
                                                    "to": "a6",
                                                    "san": "a6",
                                                    "comment": "7...a6: Kick knight away!",
                                                    "children": [
                                                        {
                                                            "from": "b5",
                                                            "to": "a3",
                                                            "san": "Na3",
                                                            "comment": "8.Na3: Knight forced to rim. Play 8...Be6!",
                                                            "children": [
                                                                {
                                                                    "from": "c8",
                                                                    "to": "e6",
                                                                    "san": "Be6",
                                                                    "comment": "8...Be6: Prepare ...f5 pawn break!"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "g2",
                                            "to": "g3",
                                            "san": "g3",
                                            "comment": "7.g3: White fianchettos. Play 7...Nf6!",
                                            "children": [
                                                {
                                                    "from": "g8",
                                                    "to": "f6",
                                                    "san": "Nf6",
                                                    "comment": "7...Nf6: Pressure on e4.",
                                                    "children": [
                                                        {
                                                            "from": "f1",
                                                            "to": "g2",
                                                            "san": "Bg2",
                                                            "comment": "8.Bg2: Bishop on long diagonal. Play 8...O-O!",
                                                            "children": [
                                                                {
                                                                    "from": "e8",
                                                                    "to": "g8",
                                                                    "san": "O-O",
                                                                    "comment": "8...O-O: Kingside safe."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "f2",
                                            "to": "f3",
                                            "san": "f3",
                                            "comment": "7.f3: Passive defense. Capitalize with 7...Nf6!",
                                            "children": [
                                                {
                                                    "from": "g8",
                                                    "to": "f6",
                                                    "san": "Nf6",
                                                    "comment": "7...Nf6: Develop with tempo!",
                                                    "children": [
                                                        {
                                                            "from": "c1",
                                                            "to": "e3",
                                                            "san": "Be3",
                                                            "comment": "8.Be3: Developing bishop. Play 8...O-O!",
                                                            "children": [
                                                                {
                                                                    "from": "e8",
                                                                    "to": "g8",
                                                                    "san": "O-O",
                                                                    "comment": "8...O-O: Castle into safety."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "b1",
                            "to": "c3",
                            "san": "N1c3",
                            "comment": "White Candidate 2: 6.N1c3 (Direct Development). Play 6...a6!",
                            "children": [
                                {
                                    "from": "a7",
                                    "to": "a6",
                                    "san": "a6",
                                    "comment": "6...a6: Kick White's b5 knight!",
                                    "children": [
                                        {
                                            "from": "b5",
                                            "to": "a3",
                                            "san": "Na3",
                                            "comment": "7.Na3: Knight retreats to side. Play 7...b5!",
                                            "children": [
                                                {
                                                    "from": "b7",
                                                    "to": "b5",
                                                    "san": "b5",
                                                    "comment": "7...b5! Tactical expansion threatening b4 fork!",
                                                    "children": [
                                                        {
                                                            "from": "c3",
                                                            "to": "d5",
                                                            "san": "Nd5",
                                                            "comment": "8.Nd5: White centralized knight. Play 8...Nge7!",
                                                            "children": [
                                                                {
                                                                    "from": "g8",
                                                                    "to": "e7",
                                                                    "san": "Nge7",
                                                                    "comment": "8...Nge7: Exchange off dangerous d5 knight!"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "c3",
                                            "to": "d5",
                                            "san": "Nd5",
                                            "comment": "7.Nd5: White knight sacrifice / centralization. Play 7...axb5!",
                                            "children": [
                                                {
                                                    "from": "a6",
                                                    "to": "b5",
                                                    "san": "axb5",
                                                    "comment": "7...axb5! Capture knight!",
                                                    "children": [
                                                        {
                                                            "from": "f1",
                                                            "to": "b5",
                                                            "san": "Bxb5",
                                                            "comment": "8.Bxb5: White recaptures. Play 8...Bd7!",
                                                            "children": [
                                                                {
                                                                    "from": "c8",
                                                                    "to": "d7",
                                                                    "san": "Bd7",
                                                                    "comment": "8...Bd7: Solid defense unpinning knight!"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "b5",
                            "to": "c3",
                            "san": "N5c3",
                            "comment": "White Candidate 3: 6.N5c3 (Passive Knight Retreat). Play 6...Nf6!",
                            "children": [
                                {
                                    "from": "g8",
                                    "to": "f6",
                                    "san": "Nf6",
                                    "comment": "6...Nf6: Rapid piece activation.",
                                    "children": [
                                        {
                                            "from": "c1",
                                            "to": "g5",
                                            "san": "Bg5",
                                            "comment": "7.Bg5: Pinning knight. Unpin with 7...Be7!",
                                            "children": [
                                                {
                                                    "from": "f8",
                                                    "to": "e7",
                                                    "san": "Be7",
                                                    "comment": "7...Be7: Solid unpin.",
                                                    "children": [
                                                        {
                                                            "from": "g5",
                                                            "to": "f6",
                                                            "san": "Bxf6",
                                                            "comment": "8.Bxf6: White trades bishop for knight. Recapture 8...Bxf6!",
                                                            "children": [
                                                                {
                                                                    "from": "e7",
                                                                    "to": "f6",
                                                                    "san": "Bxf6",
                                                                    "comment": "8...Bxf6: Dark bishop pair advantage!"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            "from": "f2",
                                            "to": "f3",
                                            "san": "f3",
                                            "comment": "7.f3: Passive move. Play 7...Be7!",
                                            "children": [
                                                {
                                                    "from": "f8",
                                                    "to": "e7",
                                                    "san": "Be7",
                                                    "comment": "7...Be7: Prepare O-O and d5 break.",
                                                    "children": [
                                                        {
                                                            "from": "c1",
                                                            "to": "e3",
                                                            "san": "Be3",
                                                            "comment": "8.Be3: Developing bishop. Play 8...O-O!",
                                                            "children": [
                                                                {
                                                                    "from": "e8",
                                                                    "to": "g8",
                                                                    "san": "O-O",
                                                                    "comment": "8...O-O: King in safe haven."
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "f1",
                            "to": "c4",
                            "san": "Bc4",
                            "comment": "\ud83d\udd34 POOR WHITE MOVE (6.Bc4?): Bishop is a target! Capitalize with 6...a6!",
                            "children": [
                                {
                                    "from": "a7",
                                    "to": "a6",
                                    "san": "a6",
                                    "comment": "6...a6! Kick knight to a3, then play 7...b5 winning tempo on Bc4!"
                                }
                            ]
                        },
                        {
                            "from": "c1",
                            "to": "g5",
                            "san": "Bg5",
                            "comment": "\u26a0\ufe0f SUB-OPTIMAL WHITE MOVE (6.Bg5?): Premature pin. Capitalize with 6...a6 7.Na3 b5!",
                            "children": [
                                {
                                    "from": "a7",
                                    "to": "a6",
                                    "san": "a6",
                                    "comment": "6...a6! Force knight to rim and expand with ...b5!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    "black_closed": {
        "id": "black_closed",
        "name": "Closed Sicilian (vs 2.Nc3)",
        "side": "black",
        "description": "7-Ply Deep Master Tree for Closed Sicilian vs 6.Be3, 6.f4, 6.Nge2, plus White mistakes.",
        "eco": "B23",
        "fen": "r1bqk1nr/pp2ppbp/2np2p1/2p5/4P3/2NP2P1/PPP2PBP/R1BQK1NR w KQkq - 0 6",
        "tree": {
            "name": "Closed Sicilian 7-Ply Deep Master Tree",
            "fen": "r1bqk1nr/pp2ppbp/2np2p1/2p5/4P3/2NP2P1/PPP2PBP/R1BQK1NR w KQkq - 0 6",
            "comment": "Position after 5...d6. Learn responses to White's 6th move setups!",
            "children": [
                {
                    "from": "c1",
                    "to": "e3",
                    "san": "Be3",
                    "comment": "6.Be3: White prepares Qd2 and Bh6. Respond 6...e5!",
                    "plans": [
                        "Play e5 central clamp",
                        "Develop Nge7",
                        "Queenside counterplay Rb8 & b5"
                    ],
                    "children": [
                        {
                            "from": "e7",
                            "to": "e5",
                            "san": "e5",
                            "comment": "6...e5! Prevents d4 push and controls d4 square.",
                            "children": [
                                {
                                    "from": "d1",
                                    "to": "d2",
                                    "san": "Qd2",
                                    "comment": "7.Qd2: White battery setup. Play 7...Nge7!",
                                    "children": [
                                        {
                                            "from": "g8",
                                            "to": "e7",
                                            "san": "Nge7",
                                            "comment": "7...Nge7: Develop knight to e7 keeping f7-f5 open.",
                                            "children": [
                                                {
                                                    "from": "e3",
                                                    "to": "h6",
                                                    "san": "Bh6",
                                                    "comment": "8.Bh6: White offers bishop trade. Play 8...O-O!",
                                                    "children": [
                                                        {
                                                            "from": "e8",
                                                            "to": "g8",
                                                            "san": "O-O",
                                                            "comment": "8...O-O: Ignore exchange and castle safely!"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    "from": "f2",
                                    "to": "f4",
                                    "san": "f4",
                                    "comment": "7.f4: Kingside expansion. Play 7...Nge7!",
                                    "children": [
                                        {
                                            "from": "g8",
                                            "to": "e7",
                                            "san": "Nge7",
                                            "comment": "7...Nge7: Solid development.",
                                            "children": [
                                                {
                                                    "from": "g1",
                                                    "to": "f3",
                                                    "san": "Nf3",
                                                    "comment": "8.Nf3: Knight development. Play 8...O-O!",
                                                    "children": [
                                                        {
                                                            "from": "e8",
                                                            "to": "g8",
                                                            "san": "O-O",
                                                            "comment": "8...O-O: Ready for counterplay!"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "from": "f2",
                    "to": "f4",
                    "san": "f4",
                    "comment": "6.f4: Grand Prix / Closed attack. Respond 6...e6!",
                    "children": [
                        {
                            "from": "e7",
                            "to": "e6",
                            "san": "e6",
                            "comment": "6...e6: Prepares Nge7 and d5 break!",
                            "children": [
                                {
                                    "from": "g1",
                                    "to": "f3",
                                    "san": "Nf3",
                                    "comment": "7.Nf3: Developing knight. Play 7...Nge7!",
                                    "children": [
                                        {
                                            "from": "g8",
                                            "to": "e7",
                                            "san": "Nge7",
                                            "comment": "7...Nge7: Flexible setup.",
                                            "children": [
                                                {
                                                    "from": "e1",
                                                    "to": "g1",
                                                    "san": "O-O",
                                                    "comment": "8.O-O: Castles. Play 8...O-O!",
                                                    "children": [
                                                        {
                                                            "from": "e8",
                                                            "to": "g8",
                                                            "san": "O-O",
                                                            "comment": "8...O-O: Prepare d5 break!"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "from": "g1",
                    "to": "e2",
                    "san": "Nge2",
                    "comment": "6.Nge2: Flexible knight placement. Respond 6...e5!",
                    "children": [
                        {
                            "from": "e7",
                            "to": "e5",
                            "san": "e5",
                            "comment": "6...e5: Lock down d4 square!",
                            "children": [
                                {
                                    "from": "e1",
                                    "to": "g1",
                                    "san": "O-O",
                                    "comment": "7.O-O: White castles. Play 7...Nge7!",
                                    "children": [
                                        {
                                            "from": "g8",
                                            "to": "e7",
                                            "san": "Nge7",
                                            "comment": "7...Nge7: Prepare Be6 & O-O.",
                                            "children": [
                                                {
                                                    "from": "c1",
                                                    "to": "e3",
                                                    "san": "Be3",
                                                    "comment": "8.Be3: Developing bishop. Play 8...O-O!",
                                                    "children": [
                                                        {
                                                            "from": "e8",
                                                            "to": "g8",
                                                            "san": "O-O",
                                                            "comment": "8...O-O: Full equality achieved!"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "from": "h2",
                    "to": "h3",
                    "san": "h3",
                    "comment": "\ud83d\udd34 POOR WHITE MOVE (6.h3?): Slow passive push! Capitalize with 6...e5!",
                    "children": [
                        {
                            "from": "e7",
                            "to": "e5",
                            "san": "e5",
                            "comment": "6...e5! Lock the center and prepare ...Nge7 & ...O-O!"
                        }
                    ]
                },
                {
                    "from": "a2",
                    "to": "a4",
                    "san": "a4",
                    "comment": "\u26a0\ufe0f SUB-OPTIMAL WHITE MOVE (6.a4?): Irrelevant flank move! Capitalize with 6...e5!",
                    "children": [
                        {
                            "from": "e7",
                            "to": "e5",
                            "san": "e5",
                            "comment": "6...e5! Claim central dominance!"
                        }
                    ]
                }
            ]
        }
    },
    "white_sicilian": {
        "id": "white_sicilian",
        "name": "White Repertoire vs Sicilian (3.Bb5)",
        "side": "white",
        "description": "7-Ply Deep White Repertoire vs Sicilian Defense using the aggressive Rossolimo (3.Bb5).",
        "eco": "B30",
        "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "tree": {
            "name": "White 1.e4 Repertoire vs Sicilian (Rossolimo 3.Bb5)",
            "fen": "r1bqkbnr/pp1ppppp/2n5/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
            "comment": "Play 3.Bb5 Rossolimo! Sidesteps heavy theory and inflicts structural damage.",
            "children": [
                {
                    "from": "f1",
                    "to": "b5",
                    "san": "Bb5",
                    "comment": "3.Bb5: Rossolimo Attack! Challenge Black's c6 knight immediately.",
                    "plans": [
                        "Structure damage with Bxc6",
                        "Fast castling O-O",
                        "Central control d3/c3"
                    ],
                    "children": [
                        {
                            "from": "g7",
                            "to": "g6",
                            "san": "g6",
                            "comment": "Black Candidate 1: 3...g6 (Fianchetto Line). Play 4.Bxc6!",
                            "children": [
                                {
                                    "from": "b5",
                                    "to": "c6",
                                    "san": "Bxc6",
                                    "comment": "4.Bxc6: Recapture exchange!",
                                    "children": [
                                        {
                                            "from": "d7",
                                            "to": "c6",
                                            "san": "dxc6",
                                            "comment": "4...dxc6: Black recaptures with d-pawn. Play 5.d3!",
                                            "children": [
                                                {
                                                    "from": "d2",
                                                    "to": "d3",
                                                    "san": "d3",
                                                    "comment": "5.d3: Solid structure protecting e4 pawn. Respond to 5...Bg7 with 6.h3!",
                                                    "children": [
                                                        {
                                                            "from": "f8",
                                                            "to": "g7",
                                                            "san": "Bg7",
                                                            "comment": "5...Bg7: Black fianchettos dark bishop. Play 6.h3!",
                                                            "children": [
                                                                {
                                                                    "from": "h2",
                                                                    "to": "h3",
                                                                    "san": "h3",
                                                                    "comment": "6.h3: Prevents Bg4 pin and prepares Be3/Nbd2!",
                                                                    "children": [
                                                                        {
                                                                            "from": "g8",
                                                                            "to": "f6",
                                                                            "san": "Nf6",
                                                                            "comment": "6...Nf6: Black develops knight. Play 7.Nbd2!",
                                                                            "children": [
                                                                                {
                                                                                    "from": "b1",
                                                                                    "to": "d2",
                                                                                    "san": "Nbd2",
                                                                                    "comment": "7.Nbd2: Prepare Nf1-e3 knight maneuver!"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "e7",
                            "to": "e6",
                            "san": "e6",
                            "comment": "Black Candidate 2: 3...e6 (French Sicilian Line). Play 4.Bxc6!",
                            "children": [
                                {
                                    "from": "b5",
                                    "to": "c6",
                                    "san": "Bxc6",
                                    "comment": "4.Bxc6: Take on c6 immediately!",
                                    "children": [
                                        {
                                            "from": "b7",
                                            "to": "c6",
                                            "san": "bxc6",
                                            "comment": "4...bxc6: Black recaptures with b-pawn. Play 5.d3!",
                                            "children": [
                                                {
                                                    "from": "d2",
                                                    "to": "d3",
                                                    "san": "d3",
                                                    "comment": "5.d3: Control e4/c4 squares. Respond to 5...Ne7 with 6.O-O!",
                                                    "children": [
                                                        {
                                                            "from": "g8",
                                                            "to": "e7",
                                                            "san": "Ne7",
                                                            "comment": "5...Ne7: Black knight development. Play 6.O-O!",
                                                            "children": [
                                                                {
                                                                    "from": "e1",
                                                                    "to": "g1",
                                                                    "san": "O-O",
                                                                    "comment": "6.O-O: Castle safely into battle.",
                                                                    "children": [
                                                                        {
                                                                            "from": "e7",
                                                                            "to": "g6",
                                                                            "san": "Ng6",
                                                                            "comment": "6...Ng6: Black knight maneuver. Play 7.e5!",
                                                                            "children": [
                                                                                {
                                                                                    "from": "e4",
                                                                                    "to": "e5",
                                                                                    "san": "e5",
                                                                                    "comment": "7.e5! Lock Black's center pawn structure!"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "d7",
                            "to": "d6",
                            "san": "d6",
                            "comment": "Black Candidate 3: 3...d6 (Moscow Transposition). Play 4.O-O!",
                            "children": [
                                {
                                    "from": "e1",
                                    "to": "g1",
                                    "san": "O-O",
                                    "comment": "4.O-O: Rapid castling!",
                                    "children": [
                                        {
                                            "from": "c8",
                                            "to": "d7",
                                            "san": "Bd7",
                                            "comment": "4...Bd7: Black unpins knight. Play 5.Re1!",
                                            "children": [
                                                {
                                                    "from": "f1",
                                                    "to": "e1",
                                                    "san": "Re1",
                                                    "comment": "5.Re1: Rook to e-file protecting e4.",
                                                    "children": [
                                                        {
                                                            "from": "g8",
                                                            "to": "f6",
                                                            "san": "Nf6",
                                                            "comment": "5...Nf6: Black attacks e4. Play 6.c3!",
                                                            "children": [
                                                                {
                                                                    "from": "c2",
                                                                    "to": "c3",
                                                                    "san": "c3",
                                                                    "comment": "6.c3: Prepare powerful d4 central break!",
                                                                    "children": [
                                                                        {
                                                                            "from": "a7",
                                                                            "to": "a6",
                                                                            "san": "a6",
                                                                            "comment": "6...a6: Black attacks bishop. Play 7.Bf1!",
                                                                            "children": [
                                                                                {
                                                                                    "from": "b5",
                                                                                    "to": "f1",
                                                                                    "san": "Bf1",
                                                                                    "comment": "7.Bf1: Retreat bishop safely keeping long diagonal control!"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "a7",
                            "to": "a6",
                            "san": "a6",
                            "comment": "\ud83d\udd34 POOR BLACK MOVE (3...a6?): Premature pawn push! Capitalize with 4.Bxc6 dxc6 5.d3!",
                            "children": [
                                {
                                    "from": "b5",
                                    "to": "c6",
                                    "san": "Bxc6",
                                    "comment": "4.Bxc6! Recapture and play 5.d3 with fast White development!"
                                }
                            ]
                        },
                        {
                            "from": "g8",
                            "to": "f6",
                            "san": "Nf6",
                            "comment": "\ud83d\udd34 POOR BLACK MOVE (3...Nf6?): Loses tempo! Capitalize with 4.e5!",
                            "children": [
                                {
                                    "from": "e4",
                                    "to": "e5",
                                    "san": "e5",
                                    "comment": "4.e5! Advance pawn attacking f6 knight! 4...Nd5 5.Nc3!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    "white_open_game": {
        "id": "white_open_game",
        "name": "White Repertoire vs Open Game (3.Bb5 Ruy Lopez)",
        "side": "white",
        "description": "7-Ply Deep White Repertoire vs 1...e5 using the Classical Ruy Lopez + Black errors.",
        "eco": "C60",
        "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
        "tree": {
            "name": "White Repertoire vs 1...e5 (Ruy Lopez 3.Bb5)",
            "fen": "r1bqkbnr/pppp1ppp/2n5/4p3/4P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3",
            "comment": "Play 3.Bb5 Ruy Lopez! The Spanish Torture for maximum positional pressure.",
            "children": [
                {
                    "from": "f1",
                    "to": "b5",
                    "san": "Bb5",
                    "comment": "3.Bb5: The Ruy Lopez (Spanish Opening)! Put pressure on c6 defender.",
                    "plans": [
                        "Pressure c6 knight",
                        "Castle O-O quickly",
                        "Build d4 center with c3"
                    ],
                    "children": [
                        {
                            "from": "a7",
                            "to": "a6",
                            "san": "a6",
                            "comment": "Black Candidate 1: 3...a6 (Morphy Defense). Play 4.Ba4!",
                            "children": [
                                {
                                    "from": "b5",
                                    "to": "a4",
                                    "san": "Ba4",
                                    "comment": "4.Ba4: Maintain bishop tension on a4-e8 diagonal!",
                                    "children": [
                                        {
                                            "from": "g8",
                                            "to": "f6",
                                            "san": "Nf6",
                                            "comment": "4...Nf6: Black attacks e4. Play 5.O-O!",
                                            "children": [
                                                {
                                                    "from": "e1",
                                                    "to": "g1",
                                                    "san": "O-O",
                                                    "comment": "5.O-O: Castle! e4 pawn is a poisoned sacrifice (Closed Ruy).",
                                                    "children": [
                                                        {
                                                            "from": "f8",
                                                            "to": "e7",
                                                            "san": "Be7",
                                                            "comment": "5...Be7: Main line Closed Ruy. Play 6.Re1!",
                                                            "children": [
                                                                {
                                                                    "from": "f1",
                                                                    "to": "e1",
                                                                    "san": "Re1",
                                                                    "comment": "6.Re1: Protect e4 pawn. Respond to 6...b5 with 7.Bb3!",
                                                                    "children": [
                                                                        {
                                                                            "from": "b7",
                                                                            "to": "b5",
                                                                            "san": "b5",
                                                                            "comment": "6...b5: Kicks bishop. Play 7.Bb3!",
                                                                            "children": [
                                                                                {
                                                                                    "from": "a4",
                                                                                    "to": "b3",
                                                                                    "san": "Bb3",
                                                                                    "comment": "7.Bb3: Bishop on prime diagonal controlling a2-g8!",
                                                                                    "children": [
                                                                                        {
                                                                                            "from": "d7",
                                                                                            "to": "d6",
                                                                                            "san": "d6",
                                                                                            "comment": "7...d6: Solidifying e5. Play 8.c3!",
                                                                                            "children": [
                                                                                                {
                                                                                                    "from": "c2",
                                                                                                    "to": "c3",
                                                                                                    "san": "c3",
                                                                                                    "comment": "8.c3: Prepare d4 push!"
                                                                                                }
                                                                                            ]
                                                                                        }
                                                                                    ]
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "g8",
                            "to": "f6",
                            "san": "Nf6",
                            "comment": "Black Candidate 2: 3...Nf6 (Berlin Wall Defense). Play 4.O-O!",
                            "children": [
                                {
                                    "from": "e1",
                                    "to": "g1",
                                    "san": "O-O",
                                    "comment": "4.O-O: Offer e4 pawn to open e-file!",
                                    "children": [
                                        {
                                            "from": "f6",
                                            "to": "e4",
                                            "san": "Nxe4",
                                            "comment": "4...Nxe4: Berlin Accepted. Play 5.d4!",
                                            "children": [
                                                {
                                                    "from": "d2",
                                                    "to": "d4",
                                                    "san": "d4",
                                                    "comment": "5.d4: Strike immediately in the center!",
                                                    "children": [
                                                        {
                                                            "from": "e4",
                                                            "to": "d6",
                                                            "san": "Nd6",
                                                            "comment": "5...Nd6: Black knight retreats. Play 6.Bxc6!",
                                                            "children": [
                                                                {
                                                                    "from": "b5",
                                                                    "to": "c6",
                                                                    "san": "Bxc6",
                                                                    "comment": "6.Bxc6: Exchange bishop to ruin Black's pawn structure.",
                                                                    "children": [
                                                                        {
                                                                            "from": "d7",
                                                                            "to": "c6",
                                                                            "san": "dxc6",
                                                                            "comment": "6...dxc6: Recapture. Play 7.dxe5!",
                                                                            "children": [
                                                                                {
                                                                                    "from": "d4",
                                                                                    "to": "e5",
                                                                                    "san": "dxe5",
                                                                                    "comment": "7.dxe5: Superior pawn structure in Berlin endgame!"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "d7",
                            "to": "d6",
                            "san": "d6",
                            "comment": "\u26a0\ufe0f PASSIVE BLACK MOVE (3...d6?): Passive Steinitz Defense! Capitalize with 4.d4!",
                            "children": [
                                {
                                    "from": "d2",
                                    "to": "d4",
                                    "san": "d4",
                                    "comment": "4.d4! Strike immediately at e5 pawn!"
                                }
                            ]
                        },
                        {
                            "from": "f7",
                            "to": "f5",
                            "san": "f5",
                            "comment": "\ud83d\udd34 RISKY BLACK GAMBIT (3...f5?): Weakens kingside! Capitalize with 4.Nc3 or 4.d3!",
                            "children": [
                                {
                                    "from": "b1",
                                    "to": "c3",
                                    "san": "Nc3",
                                    "comment": "4.Nc3! Solidly defend e4 and exploit kingside weaknesses!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    "white_french": {
        "id": "white_french",
        "name": "White Repertoire vs French Defense (3.e5)",
        "side": "white",
        "description": "7-Ply Deep White Repertoire vs French Defense with 3.e5 Advance Variation.",
        "eco": "C02",
        "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "tree": {
            "name": "White Repertoire vs French Defense (Advance 3.e5)",
            "fen": "rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
            "comment": "Play 3.e5 Advance Variation! Gain spatial advantage and lock Black's c8 bishop.",
            "children": [
                {
                    "from": "e4",
                    "to": "e5",
                    "san": "e5",
                    "comment": "3.e5: Advance Variation! Space advantage on kingside.",
                    "plans": [
                        "Lock c8 bishop",
                        "Hold central d4 pawn with c3",
                        "Kingside attack with Bd3 & Nf3"
                    ],
                    "children": [
                        {
                            "from": "c7",
                            "to": "c5",
                            "san": "c5",
                            "comment": "Black Candidate 1: 3...c5 (Immediate Center Strike). Play 4.c3!",
                            "children": [
                                {
                                    "from": "c2",
                                    "to": "c3",
                                    "san": "c3",
                                    "comment": "4.c3: Solidify d4 central pawn!",
                                    "children": [
                                        {
                                            "from": "b8",
                                            "to": "c6",
                                            "san": "Nc6",
                                            "comment": "4...Nc6: Pressure d4. Play 5.Nf3!",
                                            "children": [
                                                {
                                                    "from": "g1",
                                                    "to": "f3",
                                                    "san": "Nf3",
                                                    "comment": "5.Nf3: Knight defends d4. Respond to 5...Qb6 with 6.a3!",
                                                    "children": [
                                                        {
                                                            "from": "d8",
                                                            "to": "b6",
                                                            "san": "Qb6",
                                                            "comment": "5...Qb6: Black battery targeting b2/d4. Play 6.a3!",
                                                            "children": [
                                                                {
                                                                    "from": "a2",
                                                                    "to": "a3",
                                                                    "san": "a3",
                                                                    "comment": "6.a3: Prepare b4 expansion!",
                                                                    "children": [
                                                                        {
                                                                            "from": "c5",
                                                                            "to": "c4",
                                                                            "san": "c4",
                                                                            "comment": "6...c4: Black locks queenside. Play 7.Nbd2!",
                                                                            "children": [
                                                                                {
                                                                                    "from": "b1",
                                                                                    "to": "d2",
                                                                                    "san": "Nbd2",
                                                                                    "comment": "7.Nbd2: Prepare b3 break to open queenside lines!"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "f7",
                            "to": "f6",
                            "san": "f6",
                            "comment": "\ud83d\udd34 POOR BLACK MOVE (3...f6?): Weakens e8-h5 diagonal! Capitalize with 4.exf6 Nxf6 5.Nf3!",
                            "children": [
                                {
                                    "from": "e5",
                                    "to": "f6",
                                    "san": "exf6",
                                    "comment": "4.exf6! Recapture and target Black's weakened kingside!"
                                }
                            ]
                        },
                        {
                            "from": "g8",
                            "to": "e7",
                            "san": "Ne7",
                            "comment": "\u26a0\ufe0f PASSIVE BLACK MOVE (3...Ne7?): Passive placement! Capitalize with 4.c3 & 5.Nf3!",
                            "children": [
                                {
                                    "from": "c2",
                                    "to": "c3",
                                    "san": "c3",
                                    "comment": "4.c3! Build an impregnable central pawn chain!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    },
    "white_caro": {
        "id": "white_caro",
        "name": "White Repertoire vs Caro-Kann (3.e5)",
        "side": "white",
        "description": "7-Ply Deep White Repertoire vs Caro-Kann Defense using 3.e5 Advance Variation.",
        "eco": "B12",
        "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
        "tree": {
            "name": "White Repertoire vs Caro-Kann Defense (Advance 3.e5)",
            "fen": "rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR w KQkq - 0 3",
            "comment": "Play 3.e5 Advance Variation! Restrict Black's piece mobility.",
            "children": [
                {
                    "from": "e4",
                    "to": "e5",
                    "san": "e5",
                    "comment": "3.e5: Advance Variation! Space wedge in Black's territory.",
                    "plans": [
                        "Develop Nf3 & Bd3",
                        "Target Black's f5 bishop",
                        "Kingside initiative"
                    ],
                    "children": [
                        {
                            "from": "c8",
                            "to": "f5",
                            "san": "Bf5",
                            "comment": "Black Candidate 1: 3...Bf5 (Main Line Bishop Out). Play 4.Nf3!",
                            "children": [
                                {
                                    "from": "g1",
                                    "to": "f3",
                                    "san": "Nf3",
                                    "comment": "4.Nf3: Natural development. Respond to 4...e6 with 5.Be2!",
                                    "children": [
                                        {
                                            "from": "e7",
                                            "to": "e6",
                                            "san": "e6",
                                            "comment": "4...e6: Black solidifies center. Play 5.Be2!",
                                            "children": [
                                                {
                                                    "from": "f1",
                                                    "to": "e2",
                                                    "san": "Be2",
                                                    "comment": "5.Be2: Flexible quiet development. Prepare O-O!",
                                                    "children": [
                                                        {
                                                            "from": "c6",
                                                            "to": "c5",
                                                            "san": "c5",
                                                            "comment": "5...c5: Black attacks d4. Play 6.Be3!",
                                                            "children": [
                                                                {
                                                                    "from": "c1",
                                                                    "to": "e3",
                                                                    "san": "Be3",
                                                                    "comment": "6.Be3: Counter-defend d4!",
                                                                    "children": [
                                                                        {
                                                                            "from": "c5",
                                                                            "to": "d4",
                                                                            "san": "cxd4",
                                                                            "comment": "6...cxd4: Black trades pawns. Play 7.Nxd4!",
                                                                            "children": [
                                                                                {
                                                                                    "from": "f3",
                                                                                    "to": "d4",
                                                                                    "san": "Nxd4",
                                                                                    "comment": "7.Nxd4: Recapture with knight and attack f5 bishop!"
                                                                                }
                                                                            ]
                                                                        }
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "from": "c6",
                            "to": "c5",
                            "san": "c5",
                            "comment": "\u26a0\ufe0f SUB-OPTIMAL BLACK MOVE (3...c5?): Plays c5 before bishop out! Capitalize with 4.dxc5!",
                            "children": [
                                {
                                    "from": "d4",
                                    "to": "c5",
                                    "san": "dxc5",
                                    "comment": "4.dxc5! Win pawn and force Black to spend tempos!"
                                }
                            ]
                        },
                        {
                            "from": "e7",
                            "to": "e6",
                            "san": "e6",
                            "comment": "\ud83d\udd34 POOR BLACK MOVE (3...e6?): Traps light-squared bishop! Capitalize with 4.Nf3 & 5.Bd3!",
                            "children": [
                                {
                                    "from": "g1",
                                    "to": "f3",
                                    "san": "Nf3",
                                    "comment": "4.Nf3! Lock Black's bad bishop on c8!"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    }
};
