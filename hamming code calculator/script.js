function calculateHamming() {
  var inputData = document.getElementById('input-data').value.trim();

  // Verinin uzunluğunu kontrol et
  var dataLength = inputData.length;
  if (dataLength !== 4 && dataLength !== 8 && dataLength !== 16) {
    alert('Veri 4, 8 veya 16 bit uzunluğunda olmalıdır.');
    return;
  }

  var hammingCode = generateHammingCode(inputData);
  document.getElementById('hamming-code').innerText = hammingCode;

  // Rastgele hata oluştur ve ekrana yazdır
  var errorBit = Math.floor(Math.random() * hammingCode.length);
  var faultyHammingCode = flipBit(hammingCode, errorBit);
  var detectedErrorPosition = findErrorPosition(faultyHammingCode);
  var correctedHammingCode = correctData(faultyHammingCode, detectedErrorPosition);
  var detectedErrorPositionText = detectedErrorPosition !== 0 ? detectedErrorPosition - 1 : 'Yok';

  document.getElementById('faulty-hamming-code').innerText = faultyHammingCode;
  document.getElementById('error-position').innerText = 'Yapay hata eklenen bit: ' + errorBit + ' / Tespit edilen hatalı bit: ' + detectedErrorPositionText;
  document.getElementById('corrected-data').innerText = correctedHammingCode;
}

function generateHammingCode(data) {
  var m = data.length;
  var r = Math.ceil(Math.log2(m + Math.log2(m) + 1));
  var n = m + r;
  var hammingCode = Array(n).fill(0);

  // Veri bitlerini doğru pozisyonlara yerleştir
  var j = 0;
  for (var i = 1; i <= n; i++) {
    if (Math.pow(2, j) === i) {
      j++;
    } else {
      hammingCode[i - 1] = data.charAt(i - j - 1);
    }
  }

  // Parite bitlerini hesapla
  for (var i = 0; i < r; i++) {
    var pariteBitPozisyonu = Math.pow(2, i);
    var pariteDegeri = 0;
    for (var k = pariteBitPozisyonu - 1; k < n; k += 2 * pariteBitPozisyonu) {
      for (var l = k; l < k + pariteBitPozisyonu && l < n; l++) {
        pariteDegeri ^= parseInt(hammingCode[l]);
      }
    }
    hammingCode[pariteBitPozisyonu - 1] = pariteDegeri.toString();
  }

  return hammingCode.join('');
}

function flipBit(hammingCode, bitPosition) {
  var bit = hammingCode.charAt(bitPosition);
  return hammingCode.substring(0, bitPosition) + (bit === '0' ? '1' : '0') + hammingCode.substring(bitPosition + 1);
}

function findErrorPosition(hammingCode) {
  var errorPosition = 0;
  var r = Math.ceil(Math.log2(hammingCode.length));

  for (var i = 0; i < r; i++) {
    var parityBitPos = Math.pow(2, i);
    var parityValue = 0;
    for (var k = parityBitPos - 1; k < hammingCode.length; k += 2 * parityBitPos) {
      for (var l = k; l < k + parityBitPos && l < hammingCode.length; l++) {
        parityValue ^= parseInt(hammingCode[l]);
      }
    }
    if (parityValue !== 0) {
      errorPosition += parityBitPos;
    }
  }

  return errorPosition;
}

function correctData(hammingCode, errorPosition) {
  if (errorPosition !== 0) {
    hammingCode = flipBit(hammingCode, errorPosition - 1);
  }

  return hammingCode;
}
