function initializeTabs() {
    const buttons = document.querySelectorAll('button[data-tab]');
    const sections = {
        methods: document.getElementById('methods-content'),
        types: document.getElementById('types-content')
    };
    const scrollPositions = {
        methods: 0,
        types: 0
    };

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const tab = button.getAttribute('data-tab');
            
            const activeTab = [...buttons]
                .find(b => b.classList.contains('active'))
                ?.getAttribute('data-tab');
                
            if (activeTab) {
                scrollPositions[activeTab] = sections[activeTab].scrollTop;
            }

            buttons.forEach(b => {
                if (b === button) {
                    b.classList.add('active');
                } else {
                    b.classList.remove('active');
                }
            });

            Object.values(sections).forEach(section => {
                section.classList.remove('active');
            });
            
            if (sections[tab]) {
                sections[tab].classList.add('active');
                sections[tab].scrollTop = scrollPositions[tab];
            } else {
                console.error('Section not found:', tab); 
            }
        });
    });

    Object.entries(sections).forEach(([tab, section]) => {
        if (section) {
            section.addEventListener('scroll', () => {
                scrollPositions[tab] = section.scrollTop;
            });
        } else {
            console.error('Section not found for scroll listener:', tab); 
        }
    });
}

function initializeCollapsibles() {
    const triggers = document.querySelectorAll('[data-collapse-trigger]');
    
    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const arrow = trigger.querySelector('svg');
            
            if (content && arrow) {
                content.classList.toggle('active');
                arrow.style.transform = content.classList.contains('active') 
                    ? 'rotate(180deg)' 
                    : '';
            } else {
                console.error('Missing content or arrow for trigger:', trigger); 
            }
        });
    });
}

function initializeTypeLinks() {
    document.addEventListener('click', e => {
        if (e.target.matches('a[href^="#"]')) {
            const typesTab = document.querySelector('[data-tab="types"]');
            if (typesTab) {
                typesTab.click();
            } else {
                console.error('Types tab button not found');
            }
        }
    });
}

function initializeDocumentation() {
    initializeTabs();
    initializeCollapsibles();
    initializeTypeLinks();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeDocumentation);
} else {
    initializeDocumentation();
}