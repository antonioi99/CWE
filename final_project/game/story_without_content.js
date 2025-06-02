const storyNodes = {
    "start": {
        "title": "Begin",
        "content": "",
        "type": "intro",
        "choices": [
            {
                "text": "Begin Journey",
                "nextNode": "intro"
            }
        ]
    },
    "intro": {
        "title": "The Arrival",
        "content": "",
        "type": "station",
        "exits": {
            "left": "village_path",
            "right": "forest_path"
        }
    },
    "village_path": {
        "title": "The Village Road",
        "content": "",
        "type": "village",
        "timeDistortion": true,
        "exits": {
            "right": "intro",
            "down": "village_square"
        }
    },
    "village_square": {
        "title": "The Village Square",
        "content": "",
        "type": "village",
        "timeDistortion": true,
        "exits": {
            "up": "village_path",
            "left": "library_entrance",
            "right": "garden_entrance"
        }
    },
    "library_entrance": {
        "title": "The Library Entrance",
        "content": "",
        "type": "library",
        "exits": {
            "right": "village_square",
            "up": "library_main_hall"
        }
    },
    "library_main_hall": {
        "title": "The Library Main Hall",
        "content": "",
        "type": "library",
        "exits": {
            "down": "library_entrance",
            "up": "library_conversation"
        }
    },
    "library_conversation": {
        "title": "Conversation with Dr. Albert",
        "content": "",
        "type": "library",
        "choices": [
            {
                "text": "Tell him about your mission as a spy",
                "nextNode": "reveal_mission"
            },
            {
                "text": "Ask about the manuscript in more detail",
                "nextNode": "manuscript_examination"
            },
            {
                "text": "Mention the irregular nature of time you've observed",
                "nextNode": "discuss_time_anomalies"
            }
        ]
    },
    "reveal_mission": {
        "title": "The Truth Revealed",
        "content": "",
        "type": "library",
        "exits": {
            "left": "alternative_solution",
            "right": "contemplating_violence"
        }
    },
    "manuscript_examination": {
        "title": "The Manuscript",
        "content": "",
        "type": "library",
        "choices": [
            {
                "text": "Look at the book of your possible futures",
                "nextNode": "future_book"
            },
            {
                "text": "Refuse to look",
                "nextNode": "refuse_knowledge"
            }
        ]
    },
    "discuss_time_anomalies": {
        "title": "Time's Inconsistency",
        "content": "",
        "type": "library",
        "timeDistortion": true,
        "exits": {
            "up": "time_experiment",
            "down": "library_main_hall"
        }
    },
    "forest_path": {
        "title": "The Forest Path",
        "content": "",
        "type": "forest",
        "timeDistortion": true,
        "exits": {
            "left": "intro",
            "right": "clearing",
            "down": "forest_shrine"
        }
    },
    "clearing": {
        "title": "Forest Clearing",
        "content": "",
        "type": "forest",
        "timeDistortion": true,
        "choices": [
            {
                "text": "Approach your other self",
                "nextNode": "meeting_yourself"
            },
            {
                "text": "Turn and leave the clearing",
                "nextNode": "forest_path"
            }
        ]
    },
    "forest_shrine": {
        "title": "Forest Shrine",
        "content": "",
        "type": "forest",
        "exits": {
            "up": "forest_path",
            "down": "garden_entrance"
        }
    },
    "garden_entrance": {
        "title": "The Garden Entrance",
        "content": "",
        "type": "garden",
        "exits": {
            "left": "village_square",
            "right": "garden_first_fork",
            "up": "forest_shrine"
        }
    },
    "garden_first_fork": {
        "title": "The First Fork",
        "content": "",
        "type": "garden",
        "exits": {
            "left": "garden_entrance",
            "right": "garden_mirror",
            "down": "garden_fountain"
        }
    },
    "garden_mirror": {
        "title": "The Mirror Garden",
        "content": "",
        "type": "mirror",
        "timeDistortion": true,
        "exits": {
            "left": "garden_first_fork",
            "down": "collapse_of_time"
        }
    },
    "garden_fountain": {
        "title": "The Timeless Fountain",
        "content": "",
        "type": "garden",
        "timeDistortion": true,
        "choices": [
            {
                "text": "Sit and meditate on the visions",
                "nextNode": "fountain_meditation"
            },
            {
                "text": "Continue exploring the garden",
                "nextNode": "tower_base"
            }
        ]
    },
    "fountain_meditation": {
        "title": "Visions in Water",
        "content": "",
        "type": "garden",
        "timeDistortion": true,
        "exits": {
            "up": "garden_fountain",
            "down": "tower_base"
        }
    },
    "meeting_yourself": {
        "title": "The Other You",
        "content": "",
        "type": "forest",
        "timeDistortion": true,
        "exits": {
            "up": "clearing",
            "down": "tower_base"
        }
    },
    "alternative_solution": {
        "title": "A Different Path",
        "content": "",
        "type": "library",
        "exits": {
            "up": "tower_base"
        }
    },
    "contemplating_violence": {
        "title": "The Weight of Decision",
        "content": "",
        "type": "library",
        "choices": [
            {
                "text": "Draw the gun",
                "nextNode": "gun_drawn"
            },
            {
                "text": "Remove your hand from your pocket",
                "nextNode": "alternative_solution"
            }
        ]
    },
    "gun_drawn": {
        "title": "Weapon in Hand",
        "content": "",
        "type": "library",
        "choices": [
            {
                "text": "Fire the weapon",
                "nextNode": "violence_path"
            },
            {
                "text": "Lower the gun",
                "nextNode": "mercy_path"
            }
        ]
    },
    "violence_path": {
        "title": "The Shot Fired",
        "content": "",
        "type": "library",
        "exits": {
            "up": "tower_base"
        }
    },
    "mercy_path": {
        "title": "The Gun Lowered",
        "content": "",
        "type": "library",
        "exits": {
            "up": "tower_base"
        }
    },
    "time_experiment": {
        "title": "Experimental Time",
        "content": "",
        "type": "library",
        "timeDistortion": true,
        "exits": {
            "up": "tower_base",
            "down": "discuss_time_anomalies"
        }
    },
    "future_book": {
        "title": "The Book of Possibilities",
        "content": "",
        "type": "library",
        "exits": {
            "up": "tower_base",
            "down": "manuscript_examination"
        }
    },
    "refuse_knowledge": {
        "title": "Knowledge Declined",
        "content": "",
        "type": "library",
        "exits": {
            "up": "tower_base",
            "down": "manuscript_examination"
        }
    },
    "collapse_of_time": {
        "title": "The Collapse of Time",
        "content": "",
        "type": "mirror",
        "timeDistortion": true,
        "exits": {
            "up": "garden_mirror",
            "down": "tower_base"
        }
    },
    "tower_base": {
        "title": "The Tower Base",
        "content": "",
        "type": "tower",
        "exits": {
            "up": "the_point"
        }
    },
    "the_point": {
        "title": "The Point",
        "content": "",
        "type": "tower",
        "choices": [
            {
                "text": "Send the message through violence (following the original path)",
                "nextNode": "original_ending"
            },
            {
                "text": "Use the temporal cipher (creating a new path)",
                "nextNode": "alternate_ending"
            },
            {
                "text": "Refuse to send the message (breaking the loop)",
                "nextNode": "refuse_ending"
            }
        ]
    },
    "original_ending": {
        "title": "The Original Path",
        "content": "",
        "type": "tower",
        "exits": {
            "down": "epilogue_original"
        }
    },
    "alternate_ending": {
        "title": "A New Path",
        "content": "",
        "type": "tower",
        "exits": {
            "down": "epilogue_alternate"
        }
    },
    "refuse_ending": {
        "title": "Breaking the Loop",
        "content": "",
        "type": "tower",
        "exits": {
            "down": "epilogue_refuse"
        }
    },
    "epilogue_original": {
        "title": "Epilogue: The Predetermined Path",
        "content": "",
        "type": "tower"
    },
    "epilogue_alternate": {
        "title": "Epilogue: The Divergent Path",
        "content": "",
        "type": "tower"
    },
    "epilogue_refuse": {
        "title": "Epilogue: Beyond the Labyrinth",
        "content": "",
        "type": "tower"
    }
};