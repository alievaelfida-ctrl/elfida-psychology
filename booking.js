(() => {
  const publicWhatsAppNumber = '';
  const dateInput = document.getElementById('preferred-date');
  const slotList = document.getElementById('slot-list');
  const note = document.getElementById('date-note');
  const sendButton = document.getElementById('whatsapp-request');
  if (!dateInput || !slotList || !note || !sendButton) return;

  const pad = n => String(n).padStart(2, '0');
  const today = new Date();
  dateInput.min = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
  const weeklySlots = {
    0: ['10:00','11:00','12:00','13:00','14:00','15:00','16:00'],
    3: ['07:00','08:00','09:00','17:00','18:00','19:00','20:00'],
    4: ['18:00','19:00','20:00'],
    6: ['10:00','11:00','12:00','13:00','14:00','15:00','16:00']
  };

  function selectedTime() {
    return document.querySelector('input[name="preferred_time"]:checked')?.value || '';
  }
  function updateButton() {
    sendButton.disabled = !(dateInput.value && selectedTime());
  }
  dateInput.addEventListener('change', () => {
    slotList.innerHTML = '';
    sendButton.disabled = true;
    if (!dateInput.value) return;
    const day = new Date(`${dateInput.value}T12:00:00`).getDay();
    const slots = weeklySlots[day] || [];
    if (!slots.length) {
      note.textContent = 'За този ден няма публикувани часове. Избери сряда, четвъртък, събота или неделя.';
      return;
    }
    note.textContent = 'Показаните часове са по лондонско време и се потвърждават лично.';
    for (const time of slots) {
      const label = document.createElement('label');
      label.className = 'slot-choice';
      label.innerHTML = `<input type="radio" name="preferred_time" value="${time}"><span>${time}</span>`;
      label.querySelector('input').addEventListener('change', updateButton);
      slotList.appendChild(label);
    }
  });
  sendButton.addEventListener('click', () => {
    const time = selectedTime();
    if (!dateInput.value || !time) return;
    const type = document.querySelector('input[name="session_type"]:checked')?.value || 'сесия';
    const message = `Здравейте, Елфида. Искам да попитам дали ${dateInput.value} в ${time} ч. по лондонско време е свободен час за: ${type}. Разбирам, че часът се потвърждава след Вашия отговор.`;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({event:'consultation_booking_outbound', destination_path:'wa_me', landing_version:'lp_v1'});
    if (!publicWhatsAppNumber) {
      alert('WhatsApp бутонът ще бъде активиран след добавяне на публичния бизнес номер.');
      return;
    }
    window.open(`https://wa.me/${publicWhatsAppNumber}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
  });
})();
