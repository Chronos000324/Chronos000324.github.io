// All dialogue and world placements live here. Project details remain in content.js.
window.RPG_DATA = {
  width: 1000, height: 900, spawn: {x:500,y:650},
  npcs: [
    {id:'about',name:'THE ARCHIVIST',label:'PLAYER PROFILE',x:270,y:490,color:'#bca5f5',line:'So, you want to know who created this world?',choice:'Tell me about Fazlil',title:'PLAYER PROFILE',paragraphs:[
      'I’m a Multimedia Technology student passionate about game development, especially gameplay programming and game logic.',
      'Throughout my studies and industrial training, I have been involved in several game projects, including Ngilai, Life Gacha, Doodle Survival, and Hero Must Die.',
      'I enjoy experimenting with new ideas, solving problems, and learning through hands-on development.'
    ]},
    {id:'skills',name:'THE SYSTEMS ENGINEER',label:'ARSENAL',x:270,y:300,color:'#86bbef',line:'Every developer needs the right tools.',choice:'Show me the arsenal',title:'ARSENAL',groups:[['GAME DEVELOPMENT','Unreal Engine','GDevelop'],['PROGRAMMING / LOGIC','Gameplay Programming','Game Logic','Blueprint'],['OTHER','UI Implementation','Problem Solving','Team Collaboration']]},
    {id:'projects',name:'THE PROJECT GUIDE',label:'PROJECT AREA',x:730,y:300,color:'#b5a4fb',line:'Want to explore the projects Fazlil has worked on? The four portals are just north of here.',choice:'Show me the project portals',title:'SELECT PROJECT'},
    {id:'journey',name:'THE MENTOR',label:'MY JOURNEY',x:730,y:490,color:'#9eaede',line:'Every developer starts somewhere.',choice:'Show me the journey',title:'MY JOURNEY',levels:['Learning','Building Games','Industrial Training','Current Mission: Become a better game developer']}
  ],
  portals: [
    {id:'ngilai',x:200,y:140,color:'#d17d96',shape:0},
    {id:'life-gacha',x:400,y:140,color:'#a9bdf9',shape:1},
    {id:'doodle-survival',x:600,y:140,color:'#acc8af',shape:2},
    {id:'hero-must-die',x:800,y:140,color:'#c5a577',shape:3}
  ],
  gate:{id:'contact',name:'FINAL GATE',label:'CONTACT',x:500,y:780,color:'#a99aff'},
  // Solid consoles also act as environmental landmarks.
  obstacles:[{x:90,y:355,w:95,h:45},{x:815,y:355,w:95,h:45},{x:370,y:470,w:65,h:35},{x:565,y:470,w:65,h:35}],
  quests:[['about','Meet the Archivist'],['skills','Discover the Arsenal'],['projects','Visit the Project Area'],['journey','Learn Fazlil’s Journey'],['contact','Reach the Final Gate']]
};
