// Story Nodes - The narrative content and structure of the game
const storyNodes = {
    // Starting point
    'start': {
        title: 'Begin',
        content: '<p>Welcome to The Garden of Forking Paths.</p><p>Click "Begin Journey" to start.</p>',
        type: 'intro',
        choices: [
            {
                text: "Begin Journey",
                nextNode: 'intro'
            }
        ]
    },
    
    // Introduction
    'intro': {
        title: 'The Arrival',
        content: `
            <p>The train stutters to a halt at a station with no name. You step onto the platform, aware of your precarious position. You are Yu Tsun—a spy, a professor, a man caught between worlds.</p>
            <p>War echoes in the distance. Your mission is unclear, but the weight of it presses against your chest. You carry a piece of paper with an address. And a gun.</p>
            <p>The station clock ticks irregularly. Sometimes forward. Sometimes backward.</p>
            <p>Which way will you go?</p>
        `,
        type: 'station',
        exits: {
            left: 'village_path',
            right: 'forest_path'
        }
    },
    
    // Left path from intro
    'village_path': {
        title: 'The Village Road',
        content: `
            <p>The road winds down toward a small village. Houses crouch like sleeping animals on either side of the path. Smoke rises from chimneys, but you see no people.</p>
            <p>A newspaper blows across your path. The headlines shift and change as you try to read them. One moment they announce victory, the next defeat.</p>
            <p>Time feels unstable here, as if multiple timelines are bleeding into one another.</p>
        `,
        type: 'village',
        timeDistortion: true,
        exits: {
            right: 'intro', // Back to the station
            down: 'village_square'
        }
    },
    
    // Down from village path
    'village_square': {
        title: 'The Village Square',
        content: `
            <p>The square is empty except for a fountain at its center. Water flows upward, defying gravity.</p>
            <p>As you approach, you notice your reflection in the water is not synchronized with your movements. It moves slightly before you do, as if it exists moments ahead in time.</p>
            <p>A sign points to a library to the west and a garden maze to the east.</p>
        `,
        type: 'village',
        timeDistortion: true,
        exits: {
            up: 'village_path',
            left: 'library_entrance',
            right: 'garden_entrance'
        }
    },
    
    // Library branch
    'library_entrance': {
        title: 'The Library Entrance',
        content: `
            <p>You stand before an ancient library. Its doors are carved with symbols representing various philosophical concepts of time: circles, spirals, branching lines.</p>
            <p>A plaque reads: "The Library of Echoes: Where all possible books exist."</p>
            <p>As you push open the door, you hear whispers—conversations that may have happened, or may yet happen.</p>
        `,
        type: 'library',
        exits: {
            right: 'village_square',
            up: 'library_main_hall'
        }
    },
    
    'library_main_hall': {
        title: 'The Library Main Hall',
        content: `
            <p>Shelves stretch in impossible directions, defying the external dimensions of the building. Books are organized not by author or subject, but by potential reality.</p>
            <p>An elderly librarian approaches. "Dr. Stephen Albert," he introduces himself. "I've been expecting you, though I wasn't certain which version of you would arrive."</p>
            <p>He seems to know something about your mission. Will you question him?</p>
        `,
        type: 'library',
        exits: {
            down: 'library_entrance',
            up: 'library_conversation'
        }
    },
    
    'library_conversation': {
        title: 'Conversation with Dr. Albert',
        content: `
            <p>"Your ancestor, Ts'ui Pên, created not just a labyrinth, but a novel," Dr. Albert explains. "A novel in which all possible outcomes occur simultaneously. Each fork in the narrative creates alternate realities."</p>
            <p>He shows you a manuscript. "In some branches of the story, you kill me. In others, we become lifelong friends. In yet others, you leave without our ever having met."</p>
            <p>"What brings you here? Which path are you currently walking?"</p>
        `,
        type: 'library',
        choices: [
            {
                text: "Tell him about your mission as a spy",
                nextNode: 'reveal_mission'
            },
            {
                text: "Ask about the manuscript in more detail",
                nextNode: 'manuscript_examination'
            },
            {
                text: "Mention the irregular nature of time you've observed",
                nextNode: 'discuss_time_anomalies'
            }
        ]
    },
    
    // Choice outcomes from library conversation
    'reveal_mission': {
        title: 'The Truth Revealed',
        content: `
            <p>"I am a spy," you admit. "Germany has positioned artillery near a town called Albert. I need to communicate this information to my superiors."</p>
            <p>Dr. Albert nods slowly. "And does this mission require my death? In the original story, Yu Tsun kills the scholar Albert as a means of signaling the location of the artillery."</p>
            <p>You feel the weight of the gun in your pocket. The moment stretches indefinitely.</p>
            <p>"But perhaps in this version, there is another way," he suggests.</p>
        `,
        type: 'library',
        exits: {
            left: 'alternative_solution',
            right: 'contemplating_violence'
        }
    },
    
    'manuscript_examination': {
        title: 'The Manuscript',
        content: `
            <p>The pages of the manuscript shimmer as you look at them. Letters rearrange themselves, forming different stories with each glance.</p>
            <p>"Your ancestor discovered that time is not linear, but a network of diverging and converging possibilities," explains Dr. Albert. "This library contains every book that could possibly be written—including the book of your life."</p>
            <p>He pulls another volume from the shelf. "Would you like to see how your story ends? Or perhaps how it could end?"</p>
        `,
        type: 'library',
        choices: [
            {
                text: "Look at the book of your possible futures",
                nextNode: 'future_book'
            },
            {
                text: "Refuse to look",
                nextNode: 'refuse_knowledge'
            }
        ]
    },
    
    'discuss_time_anomalies': {
        title: "Time's Inconsistency",
        content: `
            <p>"Since arriving, I've noticed that time behaves strangely," you tell Dr. Albert. "Clocks running backward, reflections moving before I do..."</p>
            <p>He smiles knowingly. "Yes, we're at a nexus point—a place where multiple timelines intersect. Here, cause and effect become... negotiable."</p>
            <p>"In some versions of reality, you've already killed me. In others, we're still engaged in this conversation decades from now."</p>
        `,
        type: 'library',
        timeDistortion: true,
        exits: {
            up: 'time_experiment',
            down: 'library_main_hall'
        }
    },
    
    // Right path from intro
    'forest_path': {
        title: 'The Forest Path',
        content: `
            <p>The path leads into a dense forest where shadows move independently of their objects. Birds sing melodies that seem to answer questions you haven't yet asked.</p>
            <p>You have a distinct feeling of being watched—not by any present observer, but perhaps by your future or past self.</p>
            <p>The forest narrows to a single path ahead, but there's a small side trail to the right.</p>
        `,
        type: 'forest',
        timeDistortion: true,
        exits: {
            left: 'intro', // Back to the station
            right: 'clearing',
            down: 'forest_shrine'
        }
    },
    
    'clearing': {
        title: 'Forest Clearing',
        content: `
            <p>The trees open to a perfect circle of grass. In the center stands a sundial, its shadow rotating continuously, marking not just hours but perhaps years or lifetimes.</p>
            <p>At the far end of the clearing, you see yourself entering from another path—but it's not quite you. This version wears different clothes, walks with a slight limp.</p>
            <p>Your doppelgänger notices you and seems equally startled.</p>
        `,
        type: 'forest',
        timeDistortion: true,
        choices: [
            {
                text: "Approach your other self",
                nextNode: 'meeting_yourself'
            },
            {
                text: "Turn and leave the clearing",
                nextNode: 'forest_path'
            }
        ]
    },
    
    'forest_shrine': {
        title: 'Forest Shrine',
        content: `
            <p>A small stone shrine stands beside the path. Inside is a statue with many faces, each looking in a different direction—into different times, perhaps.</p>
            <p>An inscription reads: "To see all paths, one must stand at the point where they diverge."</p>
            <p>The path continues downward toward what appears to be a walled garden.</p>
        `,
        type: 'forest',
        exits: {
            up: 'forest_path',
            down: 'garden_entrance'
        }
    },
    
    // Garden branch
    'garden_entrance': {
        title: 'The Garden Entrance',
        content: `
            <p>You stand before an elaborate garden maze. Its hedges are perfectly trimmed, but seem to shift position when not directly observed.</p>
            <p>A stone marker at the entrance reads: "The Garden of Forking Paths: Where all possibilities bloom."</p>
            <p>From within, you hear the distant sound of footsteps—perhaps your own, from another timeline.</p>
        `,
        type: 'garden',
        exits: {
            left: 'village_square',
            right: 'garden_first_fork',
            up: 'forest_shrine'
        }
    },
    
    'garden_first_fork': {
        title: 'The First Fork',
        content: `
            <p>The path splits before you. Both routes look identical—impossibly so, as if you're seeing the same path twice.</p>
            <p>A butterfly lands briefly on your shoulder, then divides into two butterflies, each taking a different path.</p>
            <p>Which way will you choose?</p>
        `,
        type: 'garden',
        exits: {
            left: 'garden_entrance',
            right: 'garden_mirror',
            down: 'garden_fountain'
        }
    },
    
    'garden_mirror': {
        title: 'The Mirror Garden',
        content: `
            <p>This section of the garden is filled with mirrors arranged in concentric circles. Each reflects a slightly different version of yourself.</p>
            <p>In one, you wear a military uniform. In another, academic robes. In yet another, prison clothes.</p>
            <p>As you move, the reflections move differently, making choices you did not.</p>
        `,
        type: 'mirror',
        timeDistortion: true,
        exits: {
            left: 'garden_first_fork',
            down: 'collapse_of_time'
        }
    },
    
    'garden_fountain': {
        title: 'The Timeless Fountain',
        content: `
            <p>A circular fountain stands at what feels like the heart of the garden. Water flows in impossible patterns, sometimes reversing against gravity.</p>
            <p>Looking into the water, you see scenes from your life—some familiar, others completely foreign. Events that might have been, or might yet be.</p>
            <p>A small stone bench invites contemplation.</p>
        `,
        type: 'garden',
        timeDistortion: true,
        choices: [
            {
                text: "Sit and meditate on the visions",
                nextNode: 'fountain_meditation'
            },
            {
                text: "Continue exploring the garden",
                nextNode: 'tower_base'
            }
        ]
    },
    
    // More advanced nodes - paths converging toward the conclusion
    'fountain_meditation': {
        title: 'Visions in Water',
        content: `
            <p>As you gaze into the fountain, time dissolves around you. You see yourself making every possible choice simultaneously—a superposition of all potential Yu Tsuns.</p>
            <p>In some timelines, you complete your mission through violence. In others, you find a different path. In yet others, you abandon your mission entirely.</p>
            <p>Yet all paths seem to lead to a single tower at the center of everything.</p>
        `,
        type: 'garden',
        timeDistortion: true,
        exits: {
            up: 'garden_fountain',
            down: 'tower_base'
        }
    },
    
    'meeting_yourself': {
        title: 'The Other You',
        content: `
            <p>"I chose differently," your doppelgänger says before you can speak. "I turned right at the station, where you turned left."</p>
            <p>"How do you know which path I took?" you ask.</p>
            <p>"Because I remember standing where you stand now, meeting a version of myself who had taken a different path. We are caught in a loop of meeting ourselves."</p>
            <p>He points to a tower visible in the distance. "All paths eventually lead there—to The Point."</p>
        `,
        type: 'forest',
        timeDistortion: true,
        exits: {
            up: 'clearing',
            down: 'tower_base'
        }
    },
    
    'alternative_solution': {
        title: 'A Different Path',
        content: `
            <p>"Perhaps there is another way to signal the location," Dr. Albert suggests. "One that doesn't require my death."</p>
            <p>"The manuscript of your ancestor contains a cipher—a way of communicating that transcends linear time. We could use it to send your message."</p>
            <p>He leads you to a tower adjoining the library. "From here, we can access The Point—where all timelines converge."</p>
        `,
        type: 'library',
        exits: {
            up: 'tower_base'
        }
    },
    
    'contemplating_violence': {
        title: 'The Weight of Decision',
        content: `
            <p>Your hand moves toward your pocket where the gun rests. Dr. Albert notices the gesture but doesn't flinch.</p>
            <p>"In the original story, this is where you shoot me," he says calmly. "My name in the newspaper becomes the signal for the location of Albert."</p>
            <p>"But consider this: what if that action isn't predetermined? What if, at this junction, you could choose differently?"</p>
        `,
        type: 'library',
        choices: [
            {
                text: "Draw the gun",
                nextNode: 'gun_drawn'
            },
            {
                text: "Remove your hand from your pocket",
                nextNode: 'alternative_solution'
            }
        ]
    },
    
    'gun_drawn': {
        title: 'Weapon in Hand',
        content: `
            <p>The weight of the pistol feels simultaneously foreign and familiar in your hand. Dr. Albert looks at it without surprise or fear.</p>
            <p>"Even this moment branches," he says. "In some realities, you fire. In others, you lower the weapon. Both Yu Tsuns exist, continue to exist."</p>
            <p>Your finger rests on the trigger. Time seems to stop, waiting for your decision.</p>
        `,
        type: 'library',
        choices: [
            {
                text: "Fire the weapon",
                nextNode: 'violence_path'
            },
            {
                text: "Lower the gun",
                nextNode: 'mercy_path'
            }
        ]
    },
    
    'violence_path': {
        title: 'The Shot Fired',
        content: `
            <p>The sound of the gunshot echoes strangely, as if happening both now and in the distant past. Dr. Albert falls.</p>
            <p>As he collapses, he whispers: "This was always one of the paths. But not the only one."</p>
            <p>You feel a strange doubling—as if another version of yourself has just made a different choice. Both realities seem to exist simultaneously.</p>
            <p>Through the window, you see a tower in the distance. Something pulls you toward it.</p>
        `,
        type: 'library',
        exits: {
            up: 'tower_base'
        }
    },
    
    'mercy_path': {
        title: 'The Gun Lowered',
        content: `
            <p>You lower the weapon. Dr. Albert nods, not in relief but in acknowledgment—as if this outcome was equally possible to any other.</p>
            <p>"In the original tale, you kill me," he says. "But perhaps this version of the story has a different path."</p>
            <p>He gestures toward the window, where a tower is visible in the distance. "Come, let us find another way to complete your mission."</p>
        `,
        type: 'library',
        exits: {
            up: 'tower_base'
        }
    },
    
    'time_experiment': {
        title: 'Experimental Time',
        content: `
            <p>"Let me demonstrate something," Dr. Albert says. He takes a book from the shelf and drops it.</p>
            <p>Before it hits the ground, it freezes in mid-air. Then it rises back to his hand.</p>
            <p>"Here, time is malleable. We can send your message back through time itself, without violence."</p>
            <p>He points to a spiral staircase. "The tower awaits. There, we can access The Point."</p>
        `,
        type: 'library',
        timeDistortion: true,
        exits: {
            up: 'tower_base',
            down: 'discuss_time_anomalies'
        }
    },
    
    'future_book': {
        title: 'The Book of Possibilities',
        content: `
            <p>The book shows not one future, but many—pages splitting and multiplying as you turn them.</p>
            <p>You see yourself dying in custody, succeeding in your mission, abandoning it entirely, living to old age in anonymity...</p>
            <p>But every version of the story contains a tower. A convergence point where all possible Yu Tsuns meet.</p>
            <p>"That is The Point," Dr. Albert explains. "The center of the labyrinth."</p>
        `,
        type: 'library',
        exits: {
            up: 'tower_base',
            down: 'manuscript_examination'
        }
    },
    
    'refuse_knowledge': {
        title: 'Knowledge Declined',
        content: `
            <p>"Some things should remain unread," you say, pushing the book away.</p>
            <p>Dr. Albert smiles. "A wise choice, perhaps. To know all endings is to rob them of their meaning."</p>
            <p>He places the book back on the shelf, but points to a tower visible through the window. "Nevertheless, all paths lead there eventually. To The Point."</p>
        `,
        type: 'library',
        exits: {
            up: 'tower_base',
            down: 'manuscript_examination'
        }
    },
    
    'collapse_of_time': {
        title: 'The Collapse of Time',
        content: `
            <p>The mirrors begin to crack. Through the fractures, you glimpse other versions of the garden, the library, the forest—all merging into one impossible space.</p>
            <p>Time itself seems to be folding, collapsing different moments into a single point.</p>
            <p>Above the chaos rises a tower, somehow stable amid the temporal distortion. A refuge, perhaps. Or the eye of the storm.</p>
        `,
        type: 'mirror',
        timeDistortion: true,
        exits: {
            up: 'garden_mirror',
            down: 'tower_base'
        }
    },
    
    // The final convergence point
    'tower_base': {
        title: 'The Tower Base',
        content: `
            <p>All paths have led you here, to the base of an impossible tower. Its architecture defies logic—staircases turning back on themselves, windows looking into other times.</p>
            <p>The door bears an inscription: "The Point—where all possibilities converge."</p>
            <p>You sense that entering means confronting every version of yourself, every choice made and unmade.</p>
        `,
        type: 'tower',
        exits: {
            up: 'the_point'
        }
    },
    
    'the_point': {
        title: 'The Point',
        content: `
            <p>The tower's interior is a single circular room. Maps and manuscripts cover the walls—all variations of the same labyrinth.</p>
            <p>In the center stands a pedestal with what appears to be a telegraph machine.</p>
            <p>You understand now. This is where the message must be sent. This is where your mission concludes.</p>
            <p>But how will you complete it?</p>
        `,
        type: 'tower',
        choices: [
            {
                text: "Send the message through violence (following the original path)",
                nextNode: 'original_ending'
            },
            {
                text: "Use the temporal cipher (creating a new path)",
                nextNode: 'alternate_ending'
            },
            {
                text: "Refuse to send the message (breaking the loop)",
                nextNode: 'refuse_ending'
            }
        ]
    },
    
    // The three possible endings
    'original_ending': {
        title: 'The Original Path',
        content: `
            <p>You decide to follow the path as it was written. Violence begets violence, and war requires sacrifice.</p>
            <p>As you make your choice, you feel time solidifying around you—the many branches of possibility collapsing into a single, determinate reality.</p>
            <p>The name "Albert" will appear in the newspapers. Your mission will be complete.</p>
            <p>You turn to leave the tower, knowing what must come next.</p>
        `,
        type: 'tower',
        exits: {
            down: 'epilogue_original'
        }
    },
    
    'alternate_ending': {
        title: 'A New Path',
        content: `
            <p>You activate the temporal cipher, sending your message across time itself. The location "Albert" will be known without bloodshed.</p>
            <p>As the machine works, you feel the branching possibilities around you—not collapsing, but multiplying. You have created a new path in the garden.</p>
            <p>Perhaps this is what your ancestor intended all along: not a single labyrinth, but an infinite network of them.</p>
        `,
        type: 'tower',
        exits: {
            down: 'epilogue_alternate'
        }
    },
    
    'refuse_ending': {
        title: 'Breaking the Loop',
        content: `
            <p>You step away from the pedestal. Some cycles deserve to be broken.</p>
            <p>As you make this choice, the tower begins to shimmer, becoming transparent. Through its walls, you see not one garden but many—countless possible worlds.</p>
            <p>"Time is not a line, but a labyrinth," you recall Dr. Albert saying. And now you understand: you are not just walking the labyrinth, you are creating it.</p>
        `,
        type: 'tower',
        exits: {
            down: 'epilogue_refuse'
        }
    },
    
    // Epilogues
    'epilogue_original': {
        title: 'Epilogue: The Predetermined Path',
        content: `
            <p>They arrested you, of course. The newspaper announced the murder of Dr. Stephen Albert, and within days, the German artillery position near the town of Albert was destroyed.</p>
            <p>Your mission complete, you await execution in your cell. Yet something strange occurs: you begin to write your story, only to find it already written—as if by another version of yourself.</p>
            <p>As the guard comes to take you away, you wonder: was this the only possible outcome, or merely one branch among many?</p>
            <p><em>End of story. Refresh to explore other paths.</em></p>
        `,
        type: 'tower'
    },
    
    'epilogue_alternate': {
        title: 'Epilogue: The Divergent Path',
        content: `
            <p>Your message was received. The artillery at Albert was destroyed. But history recorded no murder of Dr. Stephen Albert.</p>
            <p>Together, you and the doctor continue to study the manuscript of Ts'ui Pên. You learn to navigate the garden of forking paths—not as a prisoner of time, but as its explorer.</p>
            <p>Sometimes, you glimpse other versions of yourself through the labyrinth's mirrors. You wonder what choices they made, what paths they walked.</p>
            <p><em>End of story. Refresh to explore other paths.</em></p>
        `,
        type: 'tower'
    },
    
    'epilogue_refuse': {
        title: 'Epilogue: Beyond the Labyrinth',
        content: `
            <p>They say the garden contains all possible paths. But perhaps there are paths that lead outside the garden itself.</p>
            <p>By refusing to complete your mission, you step outside the narrative that contained you. The war continues without your intervention. Dr. Albert lives. You disappear.</p>
            <p>Years later, travelers speak of a stranger who guards an impossible tower, warning visitors that time is not what they believe it to be.</p>
            <p><em>End of story. Refresh to explore other paths.</em></p>
        `,
        type: 'tower'
    }
};

module.exports = storyNodes;