// ===== 侧边栏交互 =====
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const mainContent = document.querySelector('.main-content');
    
    // 侧边栏折叠
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            mainContent.classList.toggle('expanded');
        });
    }
    
    // 移动端菜单
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
    
    // 子菜单展开/收起
    const submenuToggles = document.querySelectorAll('.submenu-toggle');
    submenuToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            // 只在移动设备上阻止默认行为并切换子菜单
            if (window.innerWidth <= 992) {
                e.preventDefault();
                const parent = this.parentElement;
                const submenu = parent.querySelector('.submenu');
                
                // 关闭其他子菜单
                document.querySelectorAll('.has-submenu.open').forEach(function(item) {
                    if (item !== parent) {
                        item.classList.remove('open');
                        item.querySelector('.submenu').classList.remove('open');
                    }
                });
                
                parent.classList.toggle('open');
                submenu.classList.toggle('open');
            }
            // 桌面设备上允许正常跳转
        });
    });
    
    // 锚点平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // 当前页面高亮
    const currentFileName = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-list a, .submenu a').forEach(function(link) {
        const linkHref = link.getAttribute('href');
        if (!linkHref || linkHref.startsWith('#')) return;
        
        // 标准化链接路径：提取文件名
        const linkFileName = linkHref.split('/').pop();
        
        // 如果链接文件名与当前页面文件名匹配，则高亮
        if (linkFileName === currentFileName) {
            link.classList.add('active');
            // 展开父菜单
            const parentSubmenu = link.closest('.submenu');
            if (parentSubmenu) {
                parentSubmenu.classList.add('open');
                parentSubmenu.parentElement.classList.add('open');
            }
        }
    });
    
    // 滚动动画
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.case-section, .level-card, .intro-card, .feature-item').forEach(function(el) {
        observer.observe(el);
    });
});

// ===== 添加动画样式 =====
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.5s ease forwards;
    }
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);

// ===== 案例折叠功能 =====
function toggleSolution(button) {
    const solutionBox = button.nextElementSibling;
    if (solutionBox.style.display === 'none' || !solutionBox.style.display) {
        solutionBox.style.display = 'block';
        button.textContent = '收起解决方案';
    } else {
        solutionBox.style.display = 'none';
        button.textContent = '查看解决方案';
    }
}

// ===== 复制代码功能 =====
function copyCode(button) {
    const codeBlock = button.previousElementSibling;
    const text = codeBlock.textContent;
    
    navigator.clipboard.writeText(text).then(function() {
        const originalText = button.textContent;
        button.textContent = '已复制!';
        button.style.background = '#27ae60';
        
        setTimeout(function() {
            button.textContent = originalText;
            button.style.background = '';
        }, 2000);
    });
}
