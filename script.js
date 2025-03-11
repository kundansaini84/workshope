// Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Form Submission
const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Here you would typically send this data to a server
    console.log('Form submitted:', { name, email, message });
    
    // Clear form
    contactForm.reset();
    alert('Thank you for your message!');
});

// Scroll Animation
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
});

// Observe all sections
document.querySelectorAll('section').forEach((section) => {
    observer.observe(section);
});

// Add animation class to skills
document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0)';
    });
});

class PortfolioGenerator {
    constructor() {
        this.initializeElements();
        this.bindEvents();
    }

    initializeElements() {
        this.templateStyle = document.getElementById('templateStyle');
        this.primaryColor = document.getElementById('primaryColor');
        this.secondaryColor = document.getElementById('secondaryColor');
        this.fontStyle = document.getElementById('fontStyle');
        this.industry = document.getElementById('industry');
        this.experience = document.getElementById('experience');
        this.skills = document.getElementById('skills');
        this.generateBtn = document.getElementById('generateContent');
        this.previewBtn = document.getElementById('previewTemplate');
        this.downloadBtn = document.getElementById('downloadTemplate');
        this.modal = document.getElementById('previewModal');
        this.closeModal = document.querySelector('.close-modal');
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generateContent());
        this.previewBtn.addEventListener('click', () => this.previewTemplate());
        this.downloadBtn.addEventListener('click', () => this.downloadTemplate());
        this.closeModal.addEventListener('click', () => this.closePreviewModal());
        
        // Real-time style updates
        this.primaryColor.addEventListener('input', (e) => this.updateStyles('primary', e.target.value));
        this.secondaryColor.addEventListener('input', (e) => this.updateStyles('secondary', e.target.value));
        this.fontStyle.addEventListener('change', (e) => this.updateStyles('font', e.target.value));
    }

    async generateContent() {
        try {
            const response = await fetch('/api/generate-content', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    industry: this.industry.value,
                    experience: this.experience.value,
                    skills: this.skills.value.split(',').map(skill => skill.trim())
                })
            });

            const data = await response.json();
            this.updatePortfolioContent(data);
        } catch (error) {
            console.error('Error generating content:', error);
            alert('Failed to generate content. Please try again.');
        }
    }

    updateStyles(type, value) {
        const root = document.documentElement;
        switch(type) {
            case 'primary':
                root.style.setProperty('--primary-color', value);
                break;
            case 'secondary':
                root.style.setProperty('--secondary-color', value);
                break;
            case 'font':
                document.body.style.fontFamily = value;
                break;
        }
    }

    previewTemplate() {
        this.modal.style.display = 'block';
        // Generate preview content
        const previewContent = document.getElementById('previewContent');
        previewContent.innerHTML = this.generatePreviewHTML();
    }

    closePreviewModal() {
        this.modal.style.display = 'none';
    }

    downloadTemplate() {
        const template = this.generateTemplateFiles();
        const zip = new JSZip();

        // Add files to zip
        zip.file('index.html', template.html);
        zip.file('styles.css', template.css);
        zip.file('script.js', template.js);

        // Generate and download zip
        zip.generateAsync({type: 'blob'})
            .then(content => {
                const url = window.URL.createObjectURL(content);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'portfolio-template.zip';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    }

    generatePreviewHTML() {
        // Generate preview HTML based on current settings
        return `
            <div class="preview-container">
                <!-- Generated preview content -->
            </div>
        `;
    }

    generateTemplateFiles() {
        // Return object with generated HTML, CSS, and JS content
        return {
            html: '<!-- Generated HTML -->',
            css: '/* Generated CSS */',
            js: '// Generated JavaScript'
        };
    }
}

// Initialize the generator when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioGenerator();
});
