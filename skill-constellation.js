(function() {
  'use strict';

  // Domain color mapping
  const domainColors = {
    hardware: '#10B981',   // emerald
    electrical: '#F59E0B', // amber
    software: '#3B82F6',   // blue
    ml: '#8B5CF6'          // purple
  };

  const domainLabels = {
    hardware: 'Hardware/Mechanical',
    electrical: 'Electrical/Embedded',
    software: 'Software/iOS',
    ml: 'ML/Data'
  };

  // Skill aliases for fuzzy search (search term -> actual skill names)
  const skillAliases = {
    // CAD/Design
    'cad': ['SolidWorks'],
    'solidworks': ['SolidWorks'],
    'solid works': ['SolidWorks'],
    '3d modeling': ['SolidWorks', '3D Printing'],
    'modeling': ['SolidWorks', '3D Printing'],
    'design': ['SolidWorks', 'UI/UX Design', 'PCB Design'],
    'mechanical': ['SolidWorks', '3D Printing', 'Mechatronics'],
    'printing': ['3D Printing'],
    'additive': ['3D Printing'],

    // Programming languages
    'programming': ['Python', 'C++', 'Swift', 'MicroPython'],
    'coding': ['Python', 'C++', 'Swift', 'MicroPython'],
    'c': ['C++'],
    'cpp': ['C++'],
    'javascript': ['Flask', 'REST APIs'],
    'js': ['Flask', 'REST APIs'],
    'mobile': ['Swift', 'iOS', 'SwiftUI'],
    'app': ['Swift', 'iOS', 'SwiftUI', 'Firebase'],
    'web': ['Flask', 'REST APIs', 'Firebase'],

    // ML/AI
    'ai': ['LangChain', 'RAG', 'OpenAI API', 'Enterprise AI', 'PyTorch', 'TensorFlow'],
    'artificial intelligence': ['LangChain', 'RAG', 'OpenAI API', 'Enterprise AI', 'PyTorch', 'TensorFlow'],
    'machine learning': ['PyTorch', 'TensorFlow', 'Transfer Learning', 'ResNet', 'Image Classification', 'Model Pruning'],
    'deep learning': ['PyTorch', 'TensorFlow', 'ResNet', 'Vision Transformers', 'CNN Support'],
    'neural network': ['PyTorch', 'TensorFlow', 'ResNet', 'Vision Transformers', 'CNN Support'],
    'nlp': ['LangChain', 'RAG', 'OpenAI API'],
    'llm': ['LangChain', 'RAG', 'OpenAI API', 'Enterprise AI'],
    'gpt': ['OpenAI API', 'LangChain', 'RAG'],
    'chatgpt': ['OpenAI API', 'LangChain', 'RAG'],
    'computer vision': ['PyTorch', 'TensorFlow', 'Image Classification', 'ResNet', 'Vision Transformers'],
    'cv': ['PyTorch', 'Image Classification', 'ResNet', 'Vision Transformers'],

    // Embedded/Electronics
    'embedded': ['Arduino', 'RP2040', 'MicroPython', 'Firmware', 'Embedded Systems'],
    'microcontroller': ['Arduino', 'RP2040', 'MicroPython'],
    'mcu': ['Arduino', 'RP2040', 'MicroPython'],
    'raspberry': ['RP2040'],
    'pico': ['RP2040'],
    'electronics': ['PCB Design', 'Arduino', 'Soldering', 'Power Electronics'],
    'circuit': ['PCB Design', 'Power Electronics'],
    'pcb': ['PCB Design'],
    'bluetooth': ['BLE'],
    'wireless': ['BLE', 'MQTT'],
    'iot': ['BLE', 'MQTT', 'Arduino', 'RP2040'],
    'sensor': ['Biosensors', 'IMU', 'Signal Processing'],
    'motor': ['BLDC Motors', 'Servo Motors', 'Stepper Motors'],
    'actuator': ['BLDC Motors', 'Servo Motors', 'Stepper Motors'],

    // Data/Backend
    'database': ['SQL', 'Firebase', 'Vector Databases'],
    'sql': ['SQL'],
    'backend': ['Flask', 'Firebase', 'REST APIs', 'SQL'],
    'api': ['REST APIs', 'OpenAI API'],
    'cloud': ['Firebase', 'Azure'],
    'aws': ['Azure'],

    // Robotics
    'robot': ['Robotics', 'Automation', 'Servo Motors', 'Stepper Motors'],
    'robotics': ['Robotics', 'Automation', 'Mechatronics'],
    'automation': ['Automation', 'Robotics'],
    'control': ['PID Control', 'BLDC Motors'],
    'pid': ['PID Control'],

    // Research/Documentation
    'research': ['IEEE Publishing', 'Experimental Design', 'User Studies', 'LaTeX'],
    'paper': ['IEEE Publishing', 'LaTeX'],
    'publication': ['IEEE Publishing', 'LaTeX'],
    'writing': ['IEEE Publishing', 'LaTeX'],

    // Medical/Compliance
    'medical': ['FDA Compliance', 'V&V', 'Biosensors'],
    'healthcare': ['FDA Compliance', 'V&V', 'Biosensors'],
    'fda': ['FDA Compliance', 'V&V'],
    'regulatory': ['FDA Compliance', 'V&V'],

    // New course-derived skills
    'matlab': ['MATLAB'],
    'simulink': ['Simulink'],
    'simulation': ['Simulink', 'FEA', 'MATLAB'],
    'fea': ['FEA'],
    'finite element': ['FEA'],
    'analysis': ['FEA', 'Statistical Analysis', 'MATLAB'],
    'gd&t': ['GD&T'],
    'tolerancing': ['GD&T'],
    'geometric': ['GD&T'],
    'cnc': ['CNC Machining'],
    'machining': ['CNC Machining'],
    'manufacturing': ['CNC Machining', 'Injection Molding', '3D Printing'],
    'injection': ['Injection Molding'],
    'molding': ['Injection Molding'],
    'labview': ['LabVIEW'],
    'daq': ['DAQ'],
    'data acquisition': ['DAQ'],
    'instrumentation': ['DAQ', 'LabVIEW'],
    'pandas': ['Pandas'],
    'numpy': ['NumPy'],
    'matplotlib': ['Matplotlib'],
    'plotting': ['Matplotlib'],
    'visualization': ['Matplotlib'],
    'git': ['Git'],
    'version control': ['Git'],
    'controls': ['Control Systems', 'PID Control', 'Transfer Functions'],
    'transfer function': ['Transfer Functions'],
    'statistics': ['Statistical Analysis'],
    'stats': ['Statistical Analysis'],
    'linear algebra': ['Linear Algebra'],
    'math': ['Linear Algebra', 'MATLAB'],
    'fluids': ['Fluid Mechanics'],
    'cfd': ['Fluid Mechanics'],
    'thermal': ['Heat Transfer'],
    'thermodynamics': ['Heat Transfer'],
    'materials': ['Materials Science']
  };

  // Skill to domain mapping
  const skillDomains = {
    // Hardware/Mechanical
    'SolidWorks': 'hardware',
    '3D Printing': 'hardware',
    'Vacuum Systems': 'hardware',
    'Beam Theory': 'hardware',
    'Stepper Motors': 'hardware',
    'Optical Systems': 'hardware',
    'Servo Motors': 'hardware',
    'Soldering': 'hardware',
    'Mechatronics': 'hardware',
    'GD&T': 'hardware',
    'CNC Machining': 'hardware',
    'Injection Molding': 'hardware',
    'Materials Science': 'hardware',
    'Fluid Mechanics': 'hardware',
    'Heat Transfer': 'hardware',

    // Electrical/Embedded
    'Arduino': 'electrical',
    'PCB Design': 'electrical',
    'BLE': 'electrical',
    'Firmware': 'electrical',
    'Biosensors': 'electrical',
    'RP2040': 'electrical',
    'MicroPython': 'electrical',
    'IMU': 'electrical',
    'BLDC Motors': 'electrical',
    'UART': 'electrical',
    'Power Electronics': 'electrical',
    'Embedded Systems': 'electrical',
    'MQTT': 'electrical',
    'Pan-Tompkins': 'electrical',
    'Signal Processing': 'electrical',
    'Control Systems': 'electrical',
    'Transfer Functions': 'electrical',
    'LabVIEW': 'electrical',
    'DAQ': 'electrical',

    // Software/iOS
    'C++': 'software',
    'Python': 'software',
    'Swift': 'software',
    'iOS': 'software',
    'SwiftUI': 'software',
    'Firebase': 'software',
    'REST APIs': 'software',
    'Full-Stack': 'software',
    'MapKit': 'software',
    'UI/UX Design': 'software',
    'Flask': 'software',
    'SQL': 'software',
    'Unity': 'software',
    'User Studies': 'software',
    'LaTeX': 'software',
    'IEEE Publishing': 'software',
    'Experimental Design': 'software',
    'Data Logging': 'software',
    'Robotics': 'software',
    'V&V': 'software',
    'FDA Compliance': 'software',
    'Automation': 'software',
    'Data Pipeline': 'software',
    'PID Control': 'software',
    'MATLAB': 'software',
    'Simulink': 'software',
    'FEA': 'software',
    'Git': 'software',

    // ML/Data
    'LangChain': 'ml',
    'RAG': 'ml',
    'Vector Databases': 'ml',
    'OpenAI API': 'ml',
    'Enterprise AI': 'ml',
    'Azure': 'ml',
    'PyTorch': 'ml',
    'TensorFlow': 'ml',
    'Transfer Learning': 'ml',
    'ResNet': 'ml',
    'Image Classification': 'ml',
    'Model Pruning': 'ml',
    'SEM Imaging': 'ml',
    'Vision Transformers': 'ml',
    '5-Fold CV': 'ml',
    'CNN Support': 'ml',
    'Pandas': 'ml',
    'NumPy': 'ml',
    'Matplotlib': 'ml',
    'Statistical Analysis': 'ml',
    'Linear Algebra': 'ml'
  };

  // Skill to course mapping (for class attribution)
  const skillClasses = {
    // CAD/Design
    'SolidWorks': ['ME 231', 'ME 331'],
    '3D Printing': ['ME 231'],
    'GD&T': ['ME 231'],

    // Manufacturing
    'CNC Machining': ['ME 311'],
    'Injection Molding': ['ME 310'],
    'Materials Science': ['MSE 350'],

    // Analysis
    'FEA': ['ME 331'],
    'Fluid Mechanics': ['ME 363'],
    'Heat Transfer': ['ME 364'],
    'Beam Theory': ['ME 306'],

    // Controls/Dynamics
    'MATLAB': ['ME 340', 'ME 331'],
    'Simulink': ['ME 340'],
    'Control Systems': ['ME 340'],
    'Transfer Functions': ['ME 340'],

    // Mechatronics/Embedded
    'Arduino': ['ME 376'],
    'Mechatronics': ['ME 376'],

    // Instrumentation
    'LabVIEW': ['ME 368'],
    'DAQ': ['ME 368'],
    'Experimental Design': ['ME 368'],

    // Data Science
    'Python': ['CS 220'],
    'Pandas': ['CS 220'],
    'NumPy': ['CS 220'],
    'Matplotlib': ['CS 220'],
    'Git': ['CS 220'],

    // ML
    'PyTorch': ['MSE 561'],
    'Image Classification': ['MSE 561'],
    'Statistical Analysis': ['ISYE 210'],
    'Linear Algebra': ['MATH 320']
  };

  // Helper function to open project modal (calls global function exposed by modal script)
  function triggerProjectModal(projectName) {
    if (window.openProjectModal && typeof window.openProjectModal === 'function') {
      window.openProjectModal(projectName);
    }
  }

  // Extract project data from the page
  function extractProjectData() {
    const projectData = {};

    // Access the projectData object from the modal script
    // We need to parse the skills from each project card and modal data
    const projectCards = document.querySelectorAll('.featured-card, .project-card');

    projectCards.forEach(card => {
      const title = card.querySelector('h3').textContent;
      projectData[title] = { skills: [] };
    });

    // Parse skills from the embedded projectData in the HTML
    // Since projectData is defined in an IIFE, we'll extract from the script content
    const scripts = document.querySelectorAll('script');
    let projectDataScript = null;

    scripts.forEach(script => {
      if (script.textContent.includes('const projectData = {')) {
        projectDataScript = script.textContent;
      }
    });

    if (projectDataScript) {
      // Extract skills arrays using regex
      const skillsRegex = /skills:\s*\[(.*?)\]/gs;
      const projectNameRegex = /"([^"]+)":\s*\{/g;

      const projectNames = [];
      let match;

      while ((match = projectNameRegex.exec(projectDataScript)) !== null) {
        if (match[1] !== 'tag' && match[1] !== 'images' && match[1] !== 'description' && match[1] !== 'skills' && match[1] !== 'links') {
          projectNames.push(match[1]);
        }
      }

      // For each project, find its skills
      projectNames.forEach(name => {
        const projectRegex = new RegExp(`"${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}":\\s*\\{[\\s\\S]*?skills:\\s*\\[([^\\]]+)\\]`, 'g');
        const skillMatch = projectRegex.exec(projectDataScript);

        if (skillMatch) {
          const skillsStr = skillMatch[1];
          const skills = skillsStr.match(/"([^"]+)"/g);
          if (skills) {
            projectData[name] = {
              skills: skills.map(s => s.replace(/"/g, ''))
            };
          }
        }
      });
    }

    return projectData;
  }

  // Build graph data from project skills
  function buildGraphData(projectData) {
    const skillProjects = {}; // skill -> [projects]
    const skillPairs = {};    // "skill1|skill2" -> count

    // Collect all skills and their projects
    Object.entries(projectData).forEach(([project, data]) => {
      if (!data.skills) return;

      data.skills.forEach(skill => {
        if (!skillProjects[skill]) {
          skillProjects[skill] = [];
        }
        skillProjects[skill].push(project);
      });

      // Count co-occurrences
      for (let i = 0; i < data.skills.length; i++) {
        for (let j = i + 1; j < data.skills.length; j++) {
          const pair = [data.skills[i], data.skills[j]].sort().join('|');
          skillPairs[pair] = (skillPairs[pair] || 0) + 1;
        }
      }
    });

    // Add course-only skills (skills that have classes but no projects yet)
    Object.keys(skillClasses).forEach(skill => {
      if (!skillProjects[skill]) {
        skillProjects[skill] = [];
      }
    });

    // Build nodes
    const nodes = Object.entries(skillProjects).map(([skill, projects]) => ({
      id: skill,
      projects: projects,
      classes: skillClasses[skill] || [],
      count: projects.length,
      domain: skillDomains[skill] || 'software',
      color: domainColors[skillDomains[skill]] || domainColors.software
    }));

    // Build links (only where co-occurrence >= 1)
    const links = [];
    Object.entries(skillPairs).forEach(([pair, count]) => {
      if (count >= 1) {
        const [source, target] = pair.split('|');
        links.push({
          source: source,
          target: target,
          strength: count
        });
      }
    });

    return { nodes, links };
  }

  // Initialize the constellation
  function initConstellation() {
    const container = document.querySelector('.constellation-container');
    const svg = d3.select('#skill-constellation');
    const tooltip = document.getElementById('constellation-tooltip');
    const mobileContainer = document.getElementById('skills-mobile');

    if (!container || !svg.node()) return;

    // Check if mobile
    if (window.innerWidth <= 600) {
      renderMobileFallback(mobileContainer);
      return;
    }

    const projectData = extractProjectData();
    const { nodes, links } = buildGraphData(projectData);

    if (nodes.length === 0) return;

    // Store nodes for search
    setAllSkillNodes(nodes);

    const width = container.clientWidth;
    const height = container.clientHeight;

    svg.attr('viewBox', [0, 0, width, height]);

    // Domain x positions for clustering
    const domainX = {
      hardware: width * 0.2,
      electrical: width * 0.4,
      software: width * 0.6,
      ml: width * 0.8
    };

    // Create force simulation
    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).id(d => d.id).distance(60).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-80))
      .force('collision', d3.forceCollide().radius(d => Math.sqrt(d.count) * 8 + 15))
      .force('x', d3.forceX(d => domainX[d.domain]).strength(0.15))
      .force('y', d3.forceY(height / 2).strength(0.1))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(0.05));

    // Create link elements
    const link = svg.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('class', 'constellation-link')
      .attr('stroke-width', d => Math.sqrt(d.strength));

    // Create node groups
    const node = svg.append('g')
      .selectAll('g')
      .data(nodes)
      .join('g')
      .attr('class', 'constellation-node')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended));

    // Add circles to nodes
    node.append('circle')
      .attr('r', d => Math.sqrt(d.count) * 6 + 8)
      .attr('fill', d => d.color)
      .attr('fill-opacity', 0.15)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 2);

    // Add labels
    const labels = svg.append('g')
      .selectAll('text')
      .data(nodes)
      .join('text')
      .attr('class', 'constellation-label')
      .text(d => d.id)
      .attr('dy', d => Math.sqrt(d.count) * 6 + 20);

    // Selected skill state
    let selectedSkill = null;

    // Hover interactions
    node.on('mouseenter', function(event, d) {
      if (selectedSkill) return;
      highlightConnections(d);
      showTooltip(event, d);
      labels.filter(n => n.id === d.id).classed('visible', true);
    })
    .on('mouseleave', function(event, d) {
      if (selectedSkill) return;
      clearHighlight();
      hideTooltip();
      labels.classed('visible', false);
    })
    .on('click', function(event, d) {
      event.stopPropagation();

      if (selectedSkill === d.id) {
        // Deselect
        selectedSkill = null;
        clearHighlight();
        clearProjectHighlight();
        node.classed('selected', false);
        labels.classed('visible', false);
      } else {
        // Select new skill
        selectedSkill = d.id;
        highlightConnections(d);
        node.classed('selected', n => n.id === d.id);
        labels.filter(n => n.id === d.id).classed('visible', true);
        highlightProjects(d.projects);
      }
    });

    // Click on background to deselect
    svg.on('click', function() {
      if (selectedSkill) {
        selectedSkill = null;
        clearHighlight();
        clearProjectHighlight();
        node.classed('selected', false);
        labels.classed('visible', false);
      }
    });

    // Register callback for search to select skills
    setSelectSkillCallback(function(skillName) {
      const skillNode = nodes.find(n => n.id === skillName);
      if (!skillNode) return;

      // Clear previous selection
      if (selectedSkill) {
        node.classed('selected', false);
        labels.classed('visible', false);
      }

      // Select the skill
      selectedSkill = skillName;
      highlightConnections(skillNode);
      node.classed('selected', n => n.id === skillName);
      labels.filter(n => n.id === skillName).classed('visible', true);
      highlightProjects(skillNode.projects);

      // Scroll to the skill in the constellation first
      const skillElement = node.filter(n => n.id === skillName).node();
      if (skillElement) {
        const skillsSection = document.getElementById('skills');
        if (skillsSection) {
          const offset = 120;
          const top = skillsSection.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });

    function highlightConnections(d) {
      const connectedNodes = new Set([d.id]);

      links.forEach(l => {
        if (l.source.id === d.id) connectedNodes.add(l.target.id);
        if (l.target.id === d.id) connectedNodes.add(l.source.id);
      });

      node.classed('dimmed', n => !connectedNodes.has(n.id));
      node.classed('highlighted', n => connectedNodes.has(n.id) && n.id !== d.id);

      link.classed('dimmed', l => l.source.id !== d.id && l.target.id !== d.id);
      link.classed('highlighted', l => l.source.id === d.id || l.target.id === d.id);
    }

    function clearHighlight() {
      node.classed('dimmed', false).classed('highlighted', false);
      link.classed('dimmed', false).classed('highlighted', false);
    }

    function showTooltip(event, d) {
      const domainLabel = domainLabels[d.domain];

      // Build classes section if available
      let classesHtml = '';
      if (d.classes && d.classes.length > 0) {
        classesHtml = `
          <div class="constellation-tooltip-section">
            <div class="constellation-tooltip-section-label">Classes</div>
            <div class="constellation-tooltip-classes">${d.classes.join(', ')}</div>
          </div>
        `;
      }

      // Build projects section with clickable links
      let projectsHtml = '';
      if (d.projects && d.projects.length > 0) {
        const projectList = d.projects.map(p =>
          `<span class="constellation-tooltip-project-link" data-project="${p}">${p}</span>`
        ).join('');
        projectsHtml = `
          <div class="constellation-tooltip-section">
            <div class="constellation-tooltip-section-label">Projects</div>
            <div class="constellation-tooltip-projects">${projectList}</div>
          </div>
        `;
      }

      tooltip.innerHTML = `
        <div class="constellation-tooltip-title">${d.id}</div>
        <div class="constellation-tooltip-domain" style="color: ${d.color}">${domainLabel}</div>
        ${classesHtml}
        ${projectsHtml}
      `;

      // Add click handlers for project links
      tooltip.querySelectorAll('.constellation-tooltip-project-link').forEach(link => {
        link.addEventListener('click', function(e) {
          e.stopPropagation();
          const projectName = this.dataset.project;
          // Clear skill selection and highlighting, then open modal
          selectedSkill = null;
          clearHighlight();
          clearProjectHighlight();
          node.classed('selected', false);
          labels.classed('visible', false);
          hideTooltip();
          triggerProjectModal(projectName);
        });
      });

      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Position tooltip
      let tooltipX = x + 15;
      let tooltipY = y - 10;

      // Adjust if too close to edges
      const tooltipRect = tooltip.getBoundingClientRect();
      if (tooltipX + 280 > width) {
        tooltipX = x - 290;
      }
      if (tooltipY + tooltipRect.height > height) {
        tooltipY = y - tooltipRect.height - 10;
      }

      tooltip.style.left = tooltipX + 'px';
      tooltip.style.top = tooltipY + 'px';
      tooltip.classList.add('visible');

      // Enable pointer events on tooltip so links are clickable
      tooltip.style.pointerEvents = 'auto';
    }

    function hideTooltip() {
      tooltip.classList.remove('visible');
      tooltip.style.pointerEvents = 'none';
    }

    function highlightProjects(projects) {
      const cards = document.querySelectorAll('.featured-card, .project-card');

      cards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (projects.includes(title)) {
          card.classList.add('skill-match');
          card.classList.remove('skill-dimmed');
        } else {
          card.classList.add('skill-dimmed');
          card.classList.remove('skill-match');
        }
      });
    }

    function clearProjectHighlight() {
      const cards = document.querySelectorAll('.featured-card, .project-card');
      cards.forEach(card => {
        card.classList.remove('skill-match', 'skill-dimmed');
      });
    }

    function scrollToProjects() {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const offset = 100;
        const top = projectsSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    // Drag functions
    function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    // Update positions on tick
    simulation.on('tick', () => {
      // Keep nodes within bounds
      nodes.forEach(d => {
        const r = Math.sqrt(d.count) * 6 + 10;
        d.x = Math.max(r, Math.min(width - r, d.x));
        d.y = Math.max(r, Math.min(height - r, d.y));
      });

      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);

      node.attr('transform', d => `translate(${d.x},${d.y})`);

      labels
        .attr('x', d => d.x)
        .attr('y', d => d.y);
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (window.innerWidth <= 600) {
          svg.selectAll('*').remove();
          container.style.display = 'none';
          document.querySelector('.constellation-legend').style.display = 'none';
          mobileContainer.style.display = 'block';
          renderMobileFallback(mobileContainer);
        }
      }, 250);
    });
  }

  // Mobile fallback: grouped skill badges
  function renderMobileFallback(container) {
    if (!container) return;

    const projectData = extractProjectData();
    const { nodes } = buildGraphData(projectData);

    // Store nodes for search
    setAllSkillNodes(nodes);

    // Group skills by domain
    const domains = {
      hardware: [],
      electrical: [],
      software: [],
      ml: []
    };

    nodes.forEach(node => {
      if (domains[node.domain]) {
        domains[node.domain].push(node);
      }
    });

    // Sort by project count
    Object.values(domains).forEach(arr => {
      arr.sort((a, b) => b.count - a.count);
    });

    let html = '';
    const domainOrder = ['hardware', 'electrical', 'software', 'ml'];

    domainOrder.forEach(domain => {
      if (domains[domain].length > 0) {
        html += `
          <div class="skills-mobile-group" data-domain="${domain}">
            <div class="skills-mobile-group-title">${domainLabels[domain]}</div>
            <div class="skills-mobile-badges">
              ${domains[domain].map(skill =>
                `<span class="skill-badge" data-skill="${skill.id}" data-projects='${JSON.stringify(skill.projects)}' data-classes='${JSON.stringify(skill.classes || [])}'>${skill.id}</span>`
              ).join('')}
            </div>
          </div>
        `;
      }
    });

    container.innerHTML = html;

    // Add click handlers to badges
    let selectedBadge = null;

    container.querySelectorAll('.skill-badge').forEach(badge => {
      badge.addEventListener('click', function() {
        const skill = this.dataset.skill;
        const projects = JSON.parse(this.dataset.projects);

        if (selectedBadge === skill) {
          // Deselect
          selectedBadge = null;
          this.classList.remove('selected');
          clearProjectHighlight();
        } else {
          // Deselect previous
          container.querySelectorAll('.skill-badge').forEach(b => b.classList.remove('selected'));

          // Select new
          selectedBadge = skill;
          this.classList.add('selected');
          highlightProjects(projects);
        }
      });
    });

    function highlightProjects(projects) {
      const cards = document.querySelectorAll('.featured-card, .project-card');

      cards.forEach(card => {
        const title = card.querySelector('h3').textContent;
        if (projects.includes(title)) {
          card.classList.add('skill-match');
          card.classList.remove('skill-dimmed');
        } else {
          card.classList.add('skill-dimmed');
          card.classList.remove('skill-match');
        }
      });
    }

    function clearProjectHighlight() {
      const cards = document.querySelectorAll('.featured-card, .project-card');
      cards.forEach(card => {
        card.classList.remove('skill-match', 'skill-dimmed');
      });
    }

    function scrollToProjects() {
      const projectsSection = document.getElementById('projects');
      if (projectsSection) {
        const offset = 100;
        const top = projectsSection.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    }

    // Register callback for search to select skills (mobile)
    setSelectSkillCallback(function(skillName) {
      const badge = container.querySelector(`.skill-badge[data-skill="${skillName}"]`);
      if (!badge) return;

      // Deselect previous
      container.querySelectorAll('.skill-badge').forEach(b => b.classList.remove('selected'));

      // Select and highlight
      selectedBadge = skillName;
      badge.classList.add('selected');
      const projects = JSON.parse(badge.dataset.projects);
      highlightProjects(projects);

      // Scroll badge into view
      badge.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  // Skill search functionality
  let allSkillNodes = [];
  let selectSkillCallback = null;

  function initSearch() {
    const searchInput = document.getElementById('skill-search');
    const resultsContainer = document.getElementById('skill-search-results');

    if (!searchInput || !resultsContainer) return;

    let highlightedIndex = -1;

    searchInput.addEventListener('input', function() {
      const query = this.value.trim().toLowerCase();

      if (query.length === 0) {
        resultsContainer.classList.remove('visible');
        highlightedIndex = -1;
        return;
      }

      const results = searchSkills(query);
      renderResults(results, query);
      highlightedIndex = -1;
    });

    searchInput.addEventListener('keydown', function(e) {
      const results = resultsContainer.querySelectorAll('.skill-search-result');

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        highlightedIndex = Math.min(highlightedIndex + 1, results.length - 1);
        updateHighlight(results);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        highlightedIndex = Math.max(highlightedIndex - 1, 0);
        updateHighlight(results);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          selectResult(results[highlightedIndex]);
        } else if (results.length > 0) {
          selectResult(results[0]);
        }
      } else if (e.key === 'Escape') {
        resultsContainer.classList.remove('visible');
        searchInput.blur();
      }
    });

    searchInput.addEventListener('focus', function() {
      if (this.value.trim().length > 0) {
        const results = searchSkills(this.value.trim().toLowerCase());
        renderResults(results, this.value.trim().toLowerCase());
      }
    });

    // Close results when clicking outside
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.skill-search-container')) {
        resultsContainer.classList.remove('visible');
      }
    });

    function searchSkills(query) {
      const matches = new Map(); // skill -> { score, matchType }

      // Direct skill name match
      allSkillNodes.forEach(skill => {
        const name = skill.id.toLowerCase();
        if (name === query) {
          matches.set(skill.id, { skill, score: 100, matchType: 'exact' });
        } else if (name.startsWith(query)) {
          matches.set(skill.id, { skill, score: 80, matchType: 'starts' });
        } else if (name.includes(query)) {
          matches.set(skill.id, { skill, score: 60, matchType: 'contains' });
        }
      });

      // Check aliases
      Object.entries(skillAliases).forEach(([alias, skillNames]) => {
        if (alias.includes(query) || query.includes(alias)) {
          const aliasScore = alias === query ? 90 : (alias.startsWith(query) ? 70 : 50);
          skillNames.forEach(skillName => {
            const skill = allSkillNodes.find(s => s.id === skillName);
            if (skill) {
              const existing = matches.get(skillName);
              if (!existing || existing.score < aliasScore) {
                matches.set(skillName, { skill, score: aliasScore, matchType: 'alias' });
              }
            }
          });
        }
      });

      // Sort by score, then by project count
      return Array.from(matches.values())
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return b.skill.count - a.skill.count;
        })
        .slice(0, 8); // Limit to 8 results
    }

    function renderResults(results, query) {
      if (results.length === 0) {
        resultsContainer.innerHTML = `
          <div class="skill-search-no-results">No skills found for "${query}"</div>
          <div class="skill-search-hint">Try: Python, CAD, MATLAB, FEA, machine learning, controls...</div>
        `;
        resultsContainer.classList.add('visible');
        return;
      }

      const html = results.map(({ skill }) => {
        const highlightedName = highlightMatch(skill.id, query);
        // Build source info showing both projects and classes
        let sourceInfo = '';
        if (skill.count > 0 && skill.classes && skill.classes.length > 0) {
          sourceInfo = `${skill.count} project${skill.count !== 1 ? 's' : ''} + ${skill.classes.length} class${skill.classes.length !== 1 ? 'es' : ''}`;
        } else if (skill.count > 0) {
          sourceInfo = `${skill.count} project${skill.count !== 1 ? 's' : ''}`;
        } else if (skill.classes && skill.classes.length > 0) {
          sourceInfo = `${skill.classes.length} class${skill.classes.length !== 1 ? 'es' : ''}`;
        }
        return `
          <div class="skill-search-result" data-skill="${skill.id}">
            <span class="skill-search-result-dot" style="background: ${skill.color}"></span>
            <div>
              <div class="skill-search-result-name">${highlightedName}</div>
              <div class="skill-search-result-projects">${sourceInfo}</div>
            </div>
            <span class="skill-search-result-domain">${domainLabels[skill.domain]}</span>
          </div>
        `;
      }).join('');

      resultsContainer.innerHTML = html;
      resultsContainer.classList.add('visible');

      // Add click handlers
      resultsContainer.querySelectorAll('.skill-search-result').forEach(result => {
        result.addEventListener('click', () => selectResult(result));
      });
    }

    function highlightMatch(text, query) {
      const index = text.toLowerCase().indexOf(query.toLowerCase());
      if (index === -1) return text;
      return text.slice(0, index) + '<mark>' + text.slice(index, index + query.length) + '</mark>' + text.slice(index + query.length);
    }

    function updateHighlight(results) {
      results.forEach((r, i) => {
        r.classList.toggle('highlighted', i === highlightedIndex);
      });

      // Scroll into view
      if (highlightedIndex >= 0 && results[highlightedIndex]) {
        results[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }

    function selectResult(resultEl) {
      const skillName = resultEl.dataset.skill;
      resultsContainer.classList.remove('visible');
      searchInput.value = skillName;
      searchInput.blur();

      // Trigger skill selection in constellation or mobile view
      if (selectSkillCallback) {
        selectSkillCallback(skillName);
      }
    }
  }

  // Store selectSkill callback from constellation
  function setSelectSkillCallback(callback) {
    selectSkillCallback = callback;
  }

  // Store all nodes for search
  function setAllSkillNodes(nodes) {
    allSkillNodes = nodes;
  }

  // Initialize when DOM is ready
  function init() {
    initConstellation();
    initSearch();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
