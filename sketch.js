let circles = [];

function setup() {
  createCanvas(windowWidth, windowHeight); // 設定畫布為螢幕視窗大小

  // 建立選單
  createMenu();

  // 產生 50 個圓的初始位置、顏色與大小
  for (let i = 0; i < 50; i++) {
    circles.push({
      x: random(width),
      y: random(height),
      size: 30,
      color: color(random(255), random(255), random(255))
    });
  }
}

function draw() {
  background(220);

  // 計算圓的大小隨滑鼠移動的變化
  let newSize = map(mouseX, 0, width, 20, 80);

  // 繪製每個圓
  for (let circle of circles) {
    fill(circle.color);
    noStroke();
    ellipse(circle.x, circle.y, newSize, newSize);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight); // 當視窗大小改變時，調整畫布大小
}

// 建立選單的函式
function createMenu() {
  let menu = createElement('ul'); // 建立 ul 元素
  menu.style('position', 'absolute');
  menu.style('top', '0');
  menu.style('right', '0');
  menu.style('list-style', 'none');
  menu.style('padding', '10px');
  menu.style('background', 'rgba(255, 255, 255, 0.8)');
  menu.style('border', '1px solid #ccc');
  menu.style('border-radius', '5px');
  menu.style('display', 'flex'); // 設定為橫向排列
  menu.style('gap', '20px'); // 增加選項之間的間距
  menu.style('opacity', '0'); // 初始透明度為 0
  menu.style('transition', 'opacity 0.3s ease'); // 增加漸變效果

  // 當滑鼠靠近上方時顯示選單
  let triggerArea = createDiv(); // 建立觸發區域
  triggerArea.style('position', 'absolute');
  triggerArea.style('top', '0');
  triggerArea.style('left', '0');
  triggerArea.style('width', '100%');
  triggerArea.style('height', '50px');
  triggerArea.style('background', 'transparent');
  triggerArea.style('z-index', '1000');
  triggerArea.mouseOver(() => menu.style('opacity', '1')); // 顯示選單
  menu.mouseOver(() => menu.style('opacity', '1')); // 保持選單顯示
  menu.mouseOut(() => menu.style('opacity', '0')); // 滑鼠離開時隱藏選單
  triggerArea.mouseOut(() => menu.style('opacity', '0')); // 滑鼠離開觸發區域時隱藏選單

  // 新增選單項目
  let items = ['首頁', '自我介紹', '作品集', '測驗卷', '教學影片'];
  for (let item of items) {
    let li = createElement('li', item); // 建立 li 元素
    li.parent(menu); // 將 li 加入 ul
    li.style('cursor', 'pointer');
    li.style('font-size', '18px'); // 放大字體
    li.style('padding', '5px 10px'); // 增加內邊距
    li.style('border-radius', '5px');
    li.mouseOver(() => li.style('color', 'blue'));
    li.mouseOut(() => li.style('color', 'black'));

    // 新增 "首頁" 的點擊事件
    if (item === '首頁') {
      li.mousePressed(() => {
        // 清空畫布並重新初始化
        circles = []; // 清空圓的陣列
        for (let i = 0; i < 50; i++) {
          circles.push({
            x: random(width),
            y: random(height),
            size: 30,
            color: color(random(255), random(255), random(255))
          });
        }
        // 重置選單
        createMenu();
      });
    }

    // 如果是 "作品集"，新增子選單
    if (item === '作品集') {
      let subMenu = createElement('ul'); // 建立子選單 ul 元素
      subMenu.style('list-style', 'none');
      subMenu.style('padding', '10px');
      subMenu.style('background', 'rgba(240, 240, 240, 0.9)');
      subMenu.style('border', '1px solid #ccc');
      subMenu.style('border-radius', '5px');
      subMenu.style('margin-top', '5px');
      subMenu.style('display', 'none'); // 預設隱藏

      // 新增子選單項目
      let subItems = [
        { name: '第一周作業', link: 'https://pengiii18.github.io/20250303/' },
        { name: '第二周作業', link: 'https://pengiii18.github.io/20250310/' },
        { name: '第三周作業', link: '#' },
        { name: '第四周作業', link: '#' }
      ];
      for (let subItem of subItems) {
        let subLi = createElement('li');
        let subLink = createA('#', subItem.name); // 建立連結
        subLink.style('text-decoration', 'none');
        subLink.style('color', 'black');
        subLink.mouseOver(() => subLink.style('color', 'blue'));
        subLink.mouseOut(() => subLink.style('color', 'black'));
        subLink.mousePressed((event) => {
          event.stopPropagation(); // 阻止事件冒泡，避免觸發其他點擊事件
          let iframe = select('#content-iframe');
          if (!iframe) {
            iframe = createElement('iframe'); // 建立 iframe 元素
            iframe.id('content-iframe');
            iframe.style('position', 'absolute');
            iframe.style('top', '100px'); // 將 iframe 的 top 調整為 100px，避免遮擋選單
            iframe.style('left', '50px');
            iframe.style('width', '80%');
            iframe.style('height', '80%');
            iframe.style('border', '1px solid #ccc');
            iframe.style('z-index', '1000');
            iframe.style('background', 'white');
            iframe.parent(document.body);
          }
          iframe.attribute('src', subItem.link); // 設定 iframe 的來源
          iframe.style('display', 'block'); // 顯示 iframe
        });
        subLi.child(subLink); // 將連結加入子選單項目
        subLi.style('margin', '5px 0');
        subLi.parent(subMenu); // 將子選單項目加入子選單
      }

      subMenu.parent(li); // 將子選單加入 "作品集" 項目
      li.mousePressed(() => {
        subMenu.style('display', subMenu.style('display') === 'none' ? 'block' : 'none'); // 點擊切換顯示/隱藏
      });
    }
  }
}

document.body.addEventListener('click', (event) => {
  let iframe = select('#content-iframe');
  if (iframe && !event.target.closest('#content-iframe')) {
    iframe.style('display', 'none'); // 點擊其他地方隱藏 iframe
  }
});