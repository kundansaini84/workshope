class AIPortfolioGenerator {
    constructor() {
        this.init();
        this.bindEvents();
    }

    init() {
        // Initialize elements
        this.prompt = document.getElementById('userPrompt');
        this.themeSelect = document.getElementById('themeSelect');
        this.primaryColor = document.getElementById('primaryColorPicker');
        this.secondaryColor = document.getElementById('secondaryColorPicker');
        this.accentColor = document.getElementById('accentColorPicker');
        this.fontSelect = document.getElementById('fontSelect');
        this.generateBtn = document.getElementById('generatePortfolio');
        this.downloadBtn = document.getElementById('downloadPortfolio');
        this.previewArea = document.getElementById('previewArea');
        this.loadingSpinner = document.getElementById('loadingSpinner');

        // HuggingFace API Token (free tier)
        this.API_TOKEN = "AIzaSyCmnDbiDd2hTNoYZ7AQyDy3VgA7SZb6ayo";
        this.API_URL = "AIzaSyCmnDbiDd2hTNoYZ7AQyDy3VgA7SZb6ayo";
    }

    bindEvents() {
        this.generateBtn.addEventListener('click', () => this.generatePortfolio());
        this.downloadBtn.addEventListener('click', () => this.downloadPortfolio());
        
        // Real-time style updates
        this.primaryColor.addEventListener('input', (e) => this.updateStyles('primary', e.target.value));
        this.secondaryColor.addEventListener('input', (e) => this.updateStyles('secondary', e.target.value));
        this.accentColor.addEventListener('input', (e) => this.updateStyles('accent', e.target.value));
        this.fontSelect.addEventListener('change', (e) => this.updateStyles('font', e.target.value));
    }

    async generatePortfolio() {
        try {
            this.showLoading(true);
            
            const prompt = this.formatPrompt();
            const content = await this.generateContent(prompt);
            
            this.displayGeneratedContent(content);
            this.downloadBtn.style.display = 'block';
        } catch (error) {
            console.error('Generation error:', error);
            alert('Failed to generate portfolio. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }

    async generateContent(prompt) {
        const response = await fetch(this.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.API_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 1000,
                    temperature: 0.7,
                    top_p: 0.9,
                }
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return this.formatGeneratedContent(data[0].generated_text);
    }

    formatPrompt() {
        return `Create a professional portfolio for: ${this.prompt.value}
                Style: ${this.themeSelect.value}
                Include sections for: Introduction, Skills, Experience, and Projects`;
    }

    formatGeneratedContent(content) {
        // Basic HTML template for the generated content
        return `
            <div class="generated-portfolio" style="font-family: ${this.fontSelect.value}">
                <header style="background-color: ${this.primaryColor.value}; color: white; padding: 2rem;">
                    <h1>Portfolio</h1>
                </header>
                
                <main style="padding: 2rem;">
                    ${content}
                </main>
            </div>
        `;
    }

    displayGeneratedContent(content) {
        this.previewArea.innerHTML = content;
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
            case 'accent':
                root.style.setProperty('--accent-color', value);
                break;
            case 'font':
                document.body.style.fontFamily = value;
                break;
        }
    }

    showLoading(show) {
        this.loadingSpinner.style.display = show ? 'flex' : 'none';
        this.generateBtn.disabled = show;
    }

    downloadPortfolio() {
        const content = this.previewArea.innerHTML;
        const styles = this.generateStyles();
        
        const fullHTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Generated Portfolio</title>
                <style>${styles}</style>
            </head>
            <body>
                ${content}
            </body>
            </html>
        `;

        const blob = new Blob([fullHTML], { type: 'text/html' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }

    generateStyles() {
        return `
            :root {
                --primary-color: ${this.primaryColor.value};
                --secondary-color: ${this.secondaryColor.value};
                --accent-color: ${this.accentColor.value};
            }

            body {
                font-family: ${this.fontSelect.value}, sans-serif;
                margin: 0;
                padding: 0;
                line-height: 1.6;
            }

            /* Add more generated styles based on theme */
        `;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AIPortfolioGenerator();
});
