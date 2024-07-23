// 요일 배열
const days = [
  '월요일',
  '화요일',
  '수요일',
  '목요일',
  '금요일',
  '토요일',
  '일요일',
];

// 시간 배열
const hours = [
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
];

// scheduleMatrix 초기화
var scheduleMatrix = Array.from({ length: (hours.length - 1) * 12 }, () =>
  Array(days.length).fill(0)
);

// 저장 데이터
var Data = [];

let user_id = '';

document.addEventListener('DOMContentLoaded', () => {
  const encryptedId = getCookie('encryptedId'); // 쿠키에서 암호화된 ID 가져오기
  if (encryptedId) {
      user_id = decryptCookie(encryptedId); // 암호화된 ID 복호화하기
  } else {
      console.log('암호화된 ID 쿠키가 없습니다.');
  }
});

// 테이블을 생성하는 함수
function createTable() {
  // tableContainer에서 기존 테이블 제거
  const container = document.getElementById('tableContainer');
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  // 테이블 요소 생성
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  table.id = 'calendarTable';

  // 테이블 헤더 생성
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  // 빈 셀 (왼쪽 위 칸)
  let th = document.createElement('th');
  headerRow.appendChild(th);

  // 요일 헤더 추가
  for (let i = 0; i < days.length; i++) {
    th = document.createElement('th');
    th.textContent = days[i];
    headerRow.appendChild(th);
  }
  thead.appendChild(headerRow);

  // 시간별 행 생성 (1시간 단위)
  for (let i = 0; i < hours.length - 1; i++) {
    // 1시간 단위 행
    let row = document.createElement('tr');

    // 시간 셀 (rowspan=12로 설정)
    let cell = document.createElement('td');
    cell.textContent = `${hours[i]}:00`;
    cell.rowSpan = 12; // 12개의 5분 단위 행을 차지
    row.appendChild(cell);

    // 요일별 셀 (빈 문자열로 초기화)
    for (let j = 0; j < days.length; j++) {
      let emptyCell = document.createElement('td');
      // emptyCell.textContent = `${i}, 0, ${j+1}`;
      row.appendChild(emptyCell);
    }

    tbody.appendChild(row);

    // 1시간을 12개의 칸으로 나누어 추가 (빈 문자열로 초기화)
    for (let k = 1; k < 12; k++) {
      row = document.createElement('tr');

      // 요일별 셀
      for (let l = 0; l < days.length; l++) {
        let cell = document.createElement('td');
        // cell.textContent = `${i}, ${k}, ${l}`;
        row.appendChild(cell);
      }

      tbody.appendChild(row);
    }
  }

  table.appendChild(thead);
  table.appendChild(tbody);

  // 테이블을 HTML에 추가 (여기서 id는 테이블을 추가할 div의 ID)
  document.getElementById('tableContainer').appendChild(table);
}

// select 요소의 option을 시간 배열로 동적으로 생성하는 함수
function populateTimeSelectors() {
  const startTimeHourSelect = document.getElementById('startTimeHour');
  const endTimeHourSelect = document.getElementById('endTimeHour');
  const startTimeMinuteSelect = document.getElementById('startTimeMinute');
  const endTimeMinuteSelect = document.getElementById('endTimeMinute');

  // 옵션 추가
  for (let i = 0; i < hours.length - 1; i++) {
    let option = document.createElement('option');
    option.value = hours[i];
    option.textContent = hours[i];
    startTimeHourSelect.appendChild(option);
  }

  for (let i = 0; i < hours.length; i++) {
    option = document.createElement('option');
    option.value = hours[i];
    option.textContent = hours[i];
    endTimeHourSelect.appendChild(option);
  }

  const minutes = [
    '00',
    '05',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
  ];

  for (let i = 0; i < minutes.length; i++) {
    let option = document.createElement('option');
    option.value = minutes[i];
    option.textContent = minutes[i];
    startTimeMinuteSelect.appendChild(option);

    option = document.createElement('option');
    option.value = minutes[i];
    option.textContent = minutes[i];
    endTimeMinuteSelect.appendChild(option);
  }
}

// endTimeHour가 변경될 때 endTimeMinute의 옵션을 조정하는 함수
function setEndTimeMinutesAvailability() {
  const endTimeHourSelect = document.getElementById('endTimeHour');
  const endTimeMinuteSelect = document.getElementById('endTimeMinute');
  const lastHour = hours[hours.length - 1];
  const options = endTimeMinuteSelect.options;

  // 모든 분 옵션을 비활성화
  for (let i = 1; i < options.length; i++) {
    options[i].disabled = true;
  }

  // 마지막 시간 옵션이 선택된 경우, 00만 활성화
  if (endTimeHourSelect.value === lastHour) {
    options[0].disabled = false; // '00'만 활성화
  } else {
    // 그렇지 않으면 모든 분 옵션 활성화
    for (let i = 1; i < options.length; i++) {
      options[i].disabled = false;
    }
  }
}

// endTimeHour의 변경 이벤트 리스너 추가
function addEventListeners() {
  const endTimeHourSelect = document.getElementById('endTimeHour');
  endTimeHourSelect.addEventListener('change', setEndTimeMinutesAvailability);
}

// select 요소에 요일을 동적으로 추가하는 함수
function populateDaysSelector() {
  const inputDaySelect = document.getElementById('inputDay');

  for (let i = 0; i < days.length; i++) {
    let option = document.createElement('option');
    option.value = days[i];
    option.textContent = days[i];
    inputDaySelect.appendChild(option);
  }
}

// 색깔 랜덤으로 정하는 함수
function getRandomColor(sum) {
  // 랜덤한 색상 비율을 생성
  let r = 0,
    g = 0,
    b = 0;

  // 전체 범위 765에서 각 색상의 랜덤 비율을 생성하고 합계 조정
  const rRatio = Math.random();
  const gRatio = Math.random();
  const bRatio = Math.random();

  const totalRatio = rRatio + gRatio + bRatio;

  r = Math.min(255, Math.floor((rRatio / totalRatio) * sum));
  g = Math.min(255, Math.floor((gRatio / totalRatio) * sum));
  b = Math.min(255, Math.floor((bRatio / totalRatio) * sum));

  // RGB 값이 입력값의 총합과 일치하도록 조정
  const total = r + g + b;
  if (total < sum) {
    // 부족한 양을 랜덤하게 한 색상에 추가
    const deficit = sum - total;
    const adjustment = Math.floor(Math.random() * (deficit + 1));

    if (r + adjustment <= 255) {
      r += adjustment;
    } else if (g + adjustment <= 255) {
      g += adjustment;
    } else {
      b += adjustment;
    }
  } else if (total > sum) {
    // 초과한 양을 랜덤하게 줄이기
    const excess = total - sum;
    const reduction = Math.floor(Math.random() * (excess + 1));

    if (r - reduction >= 0) {
      r -= reduction;
    } else if (g - reduction >= 0) {
      g -= reduction;
    } else {
      b -= reduction;
    }
  }
  const toHex = (value) => value.toString(16).padStart(2, '0').toUpperCase();
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// 모달 창 열기
function openEditModal() {
  initializeModal(false);
  document.getElementById('modal').style.display = 'block';
}

// 모달 창 닫기
function closeEditModal() {
  document.getElementById('modal').style.display = 'none';
}

// 인덱스 보정
function calibrateIndex(x, y) {
  let X = x;
  let Y = y;

  // for (let i = 0; i < x; i++) {
  //     if (scheduleMatrix[i][Y] === 1) {
  //         X--;
  //     }
  // }

  for (let j = 0; j < y; j++) {
    if (scheduleMatrix[X][j] === 1) {
      Y--;
    }
  }

  return [X, Y];
}

// 테이블에 일정 추가
function addSchedule(schedule) {
  let title, day, startHour, startMinute, endHour, endMinute, memo;
  if (schedule) {
    title = schedule.title;
    day = schedule.day;

    startHour = schedule.startHour;
    startMinute = schedule.startMinute;
    endHour = schedule.endHour;
    endMinute = schedule.endMinute;

    memo = schedule.memo;
  } else {
    // 제목, 요일, 시작 시간, 종료 시간, 메모를 모달에서 받아오기
    title = document.getElementById('inputText').value;
    day = document.getElementById('inputDay').value;

    startHour = parseInt(document.getElementById('startTimeHour').value, 10);
    startMinute = parseInt(
      document.getElementById('startTimeMinute').value,
      10
    );
    endHour = parseInt(document.getElementById('endTimeHour').value, 10);
    endMinute = parseInt(document.getElementById('endTimeMinute').value, 10);

    memo = document.getElementById('note').value;
  }

  // 제목이 없는 경우 알림
  if (!title) {
    alert('제목을 설정해 주세요');
    return;
  }

  // 시작시간이 더 늦는 경우 알림
  if (
    startHour > endHour ||
    (startHour === endHour && startMinute >= endMinute)
  ) {
    alert('시간을 다시 설정해주세요');
    return;
  }

  // 요일과 시작 시간, 종료 시간에 대한 인덱스 찾기
  const dayIndex = days.indexOf(day);
  const startRow = (startHour - hours[0]) * 12 + Math.floor(startMinute / 5);
  const endRow = (endHour - hours[0]) * 12 + Math.floor(endMinute / 5);
  const diff = endRow - startRow;

  // 일정이 비었는지 확인
  for (let i = startRow; i <= endRow; i++) {
    if (scheduleMatrix[i][dayIndex] > 0) {
      alert('해당 시간대에 이미 일정이 존재합니다.');
      return;
    }
  }

  // 인덱스 보정
  let tmp = calibrateIndex(startRow, dayIndex);
  let startCorrected = tmp[0];
  let dayCorrected = tmp[1];

  scheduleMatrix[startRow][dayIndex] = 2;
  for (let i = diff - 1; i >= 1; i--) {
    let [x, y] = calibrateIndex(startRow + i, dayIndex);
    if (startRow + (i % 12) == 0) {
      const cell = document.querySelector(
        `#calendarTable tbody tr:nth-child(${x + 1}) td:nth-child(${y + 2})`
      );
      cell.remove();
      console.log(x + 1, y + 2);
    } else {
      const cell = document.querySelector(
        `#calendarTable tbody tr:nth-child(${x + 1}) td:nth-child(${y + 1})`
      );
      cell.remove();
      console.log(x + 1, y + 1);
    }
  }

  console.log(startRow, endRow);
  console.log(startRow, scheduleMatrix[startRow]);
  for (let i = startRow + 1; i < endRow; i++) {
    scheduleMatrix[i][dayIndex] = 1;
    console.log(i, scheduleMatrix[i]);
  }

  // 셀 병합 및 스타일 적용
  let firstCell;
  if (startCorrected % 12 == 0) {
    firstCell = document.querySelector(
      `#calendarTable tbody tr:nth-child(${startCorrected + 1}) td:nth-child(${
        dayCorrected + 2
      })`
    );
  } else {
    firstCell = document.querySelector(
      `#calendarTable tbody tr:nth-child(${startCorrected + 1}) td:nth-child(${
        dayCorrected + 1
      })`
    );
  }

  firstCell.rowSpan = endRow - startRow;
  firstCell.style.backgroundColor = getRandomColor(512);
  firstCell.innerHTML = `<strong>${title}</strong><br>${memo}`;
  firstCell.title = `${title}\n${startHour}:${startMinute
    .toString()
    .padStart(2, '0')} - ${endHour}:${endMinute
    .toString()
    .padStart(2, '0')}\n${memo}`;

  // 스케줄 데이터 생성 및 설정
  const scheduleData = `${title}/@/${day}/@/${startHour}:${startMinute}/@/${endHour}:${endMinute}/@/${memo}/@/3000/@/*@*`;
  firstCell.setAttribute('data-schedule', JSON.stringify(scheduleData));
  Data.push(scheduleData);

  // 셀에 클릭 이벤트 리스너 추가
  firstCell.addEventListener('click', function () {
    if (confirm('이 일정을 삭제하시겠습니까?')) {
      deleteSchedule(this);
    }
  });

  // 모달 창 닫기
  closeEditModal();
}

function deleteSchedule(cell) {
  // 셀의 data-schedule 속성에서 일정 정보 가져오기
  const scheduleData = JSON.parse(cell.getAttribute('data-schedule'));
  const [title, day, startTime, endTime, memo] = scheduleData.split('/@/');
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  // 인덱스 계산
  const dayIndex = days.indexOf(day);
  const startRow = (startHour - hours[0]) * 12 + Math.floor(startMinute / 5);
  const endRow = (endHour - hours[0]) * 12 + Math.floor(endMinute / 5);
  const diff = endRow - startRow;

  // Data 배열에서 일정 제거
  Data = Data.filter((item) => item !== scheduleData);

  // scheduleMatrix에서 해당 일정 제거
  for (let i = diff - 1; i >= 0; i--) {
    let [x, y] = calibrateIndex(startRow + i, dayIndex);
    scheduleMatrix[x][y] = 0;
  }

  const data = [...Data];
  Data = [];
  createTable();
  scheduleMatrix = Array.from({ length: (hours.length - 1) * 12 }, () =>
    Array(days.length).fill(0)
  );
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const d = parseDataToSchedule(data[i]);
    addSchedule(d);
  }
  // // 테이블에서 일정 셀 제거
  // cell.remove();

  // // 빈 셀 추가
  // const table = document.querySelector('#calendarTable tbody');
  // for (let i = diff - 1; i >= 0; i--) {
  //     let [x, y] = calibrateIndex(startRow + i, dayIndex);
  //     const newRow = table.rows[x];

  //     let insertIndex = y;
  //     for (let j = 0; j < y; j++) {
  //         if (scheduleMatrix[x][j] === 1) {
  //             insertIndex--;
  //         }
  //     }
  //     if (x % 12 == 0) {
  //         insertIndex++;
  //     }
  //     const newCell = newRow.insertCell(insertIndex);
  // }
}

function dataParse(scheduleData) {
  // 입력된 데이터를 분할하여 각 부분을 추출
  const parts = scheduleData.split('/@/');

  // 제목, 요일, 시작 시간, 종료 시간, 메모를 개별 변수로 분리
  const title = parts[0];
  const day = parts[1];

  // 시작 시간과 종료 시간을 각각 분할하여 시와 분을 추출
  const [startHour, startMinute] = parts[2].split(':').map(Number);
  const [endHour, endMinute] = parts[3].split(':').map(Number);

  // 메모를 추출
  const memo = parts[4];

  // 필요한 정보들을 배열로 반환
  return [title, day, startHour, startMinute, endHour, endMinute, memo];
}

// 모달 창 초기화
function initializeModal() {
  document.getElementById('inputText').value = '';
  document.getElementById('inputDay').value = '월요일';
  document.getElementById('startTimeHour').value = '08';
  document.getElementById('startTimeMinute').value = '00';
  document.getElementById('endTimeHour').value = '09';
  document.getElementById('endTimeMinute').value = '00';
  document.getElementById('note').value = '';
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function decryptCookie(encryptedValue) {
  const bytes = CryptoJS.AES.decrypt(encryptedValue, 'fdkWMbnd@kw!MsXCFOdjwjrjdn@!!ndnzPDnensditnWECMlslx!!!!!!snUIbsnIANdNNJUWkqmsnskwq');
  return bytes.toString(CryptoJS.enc.Utf8);
}

// 데이터 저장
function saveSchedule() {
  // Data 배열을 빈 문자열로 결합하여 하나의 문자열로 만듭니다.
  const scheduleString = Data.join('');
  // scheduleString을 URL 인코딩합니다.
  const enscheduleString = encodeURIComponent(scheduleString);
  // 백엔드로 데이터 전송
  fetch(`http://localhost:8000/api/v1/time/?user_id=${user_id}&data=${enscheduleString}`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
    }
  })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error('Error:', error));
    alert('데이터 저장하기 성공.');
}


async function loadData() {
  try {
    // Fetch 요청 보내기
    const response = await fetch(`http://localhost:8000/api/v1/time/?user_id=${user_id}`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
      }
    });

    // 응답이 성공적인지 확인
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    alert('데이터 불러오기 성공.');
    // 응답 데이터를 JSON으로 파싱
    const data = await response.json();

    // 데이터 처리 (예를 들어, 문자열 데이터로 처리한 경우)
    // data가 JSON 객체라고 가정하고 데이터를 처리
    let tmp = data.toString(); // data를 문자열로 변환 (필요 시)
    const splitData = tmp.split('*@*'); // 데이터를 분리

    // 데이터와 일정 행렬 초기화
    let scheduleMatrix = Array.from({ length: (hours.length - 1) * 12 }, () =>
      Array(days.length).fill(0)
    );

    // 데이터 처리 및 일정 추가
    for (let i = 0; i < splitData.length; i++) {
      const d = parseDataToSchedule(splitData[i]);
      addSchedule(d); // addSchedule 호출 시 인수로 `d` 전달
    }

    // 테이블 생성 함수 호출
    createTable();
  } catch (error) {
    console.error('Error:', error);
  }
}

// `parseDataToSchedule`와 `addSchedule` 함수가 필요
// `createTable`은 데이터를 기반으로 테이블을 생성하는 함수


// 데이터 파싱
function parseDataToSchedule(dataArray) {
  const parts = dataArray.split('/@/');
  return {
    title: parts[0],
    day: parts[1],
    startHour: parseInt(parts[2].split(':')[0], 10),
    startMinute: parseInt(parts[2].split(':')[1], 10),
    endHour: parseInt(parts[3].split(':')[0], 10),
    endMinute: parseInt(parts[3].split(':')[1], 10),
    memo: parts[4],
  };
}

function logout(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
  window.location.href = 'login.html';
}

// 페이지 로드 시 테이블 및 select 요소 생성
window.onload = function () {
  createTable(); // 테이블 생성 함수
  populateTimeSelectors(); // 시간 선택기 옵션 설정 함수
  populateDaysSelector(); // 요일 선택기 옵션 설정 함수
  addEventListeners(); // 이벤트 리스너 추가 함수
};
