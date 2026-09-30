import { useEffect, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Geolocation } from '@capacitor/geolocation';

type Location = {
  latitude: number;
  longitude: number;
};

type Report = {
  id: number;
  title: string;
  category: string;
  description: string;
  latitude: number;
  longitude: number;
  photoDataUrl?: string;
  createdAt: string;
  status: string;
};

const categories = ['시설 파손', '전기/조명', '청결', '네트워크', '기타'];

export default function ReportPage() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [photoDataUrl, setPhotoDataUrl] = useState<string | undefined>();
  const [location, setLocation] = useState<Location | undefined>();
  const [reports, setReports] = useState<Report[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('campus-issue-reports');

    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch {
        localStorage.removeItem('campus-issue-reports');
      }
    }
  }, []);

  async function takePhoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 60,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (photo.dataUrl) {
        setPhotoDataUrl(photo.dataUrl);
      }
    } catch {
      alert('사진 촬영을 취소했거나 카메라를 사용할 수 없습니다.');
    }
  }

  async function useCurrentLocation() {
    try {
      setBusy(true);

      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    } catch {
      alert('현재 위치를 가져올 수 없습니다. 위치 권한을 확인하세요.');
    } finally {
      setBusy(false);
    }
  }

  async function saveReport() {
    if (title.trim() === '') {
      alert('제목을 입력하세요.');
      return;
    }

    if (title.trim().length > 50) {
      alert('제목은 50자 이하로 입력하세요.');
      return;
    }

    if (category === '') {
      alert('카테고리를 선택하세요.');
      return;
    }

    if (description.trim() === '') {
      alert('설명을 입력하세요.');
      return;
    }

    if (category === '시설 파손' && description.trim().length < 20) {
      alert('시설 파손 신고는 설명을 20자 이상 입력하세요.');
      return;
    }

    if (category === '전기/조명' && description.trim().length < 20) {
      alert('전기/조명 신고는 설명을 20자 이상 입력하세요.');
      return;
    }

    try {
      setBusy(true);

      let currentLocation = location;

      if (!currentLocation) {
        const position = await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        currentLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        setLocation(currentLocation);
      }

      const report: Report = {
        id: Date.now(),
        title: title.trim(),
        category,
        description: description.trim(),
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        photoDataUrl,
        createdAt: new Date().toISOString(),
        status: '접수',
      };

      const saved = localStorage.getItem('campus-issue-reports');
      const oldReports: Report[] = saved ? JSON.parse(saved) : [];
      oldReports.unshift(report);

      localStorage.setItem('campus-issue-reports', JSON.stringify(oldReports));
      setReports(oldReports);

      setTitle('');
      setCategory('');
      setDescription('');
      setPhotoDataUrl(undefined);
      setLocation(undefined);

      alert('신고가 등록되었습니다.');
    } catch {
      alert('신고를 저장하지 못했습니다. 위치 권한과 저장 공간을 확인하세요.');
    } finally {
      setBusy(false);
    }
  }

  function clearAllReports() {
    if (!confirm('저장된 신고를 모두 삭제할까요?')) {
      return;
    }

    localStorage.removeItem('campus-issue-reports');
    setReports([]);
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="eyebrow">Agile Design 2 · Refactoring Lab</p>
        <h1>Campus Issue Reporter</h1>
        <p>교내 시설의 고장과 불편 사항을 사진과 위치 정보와 함께 기록합니다.</p>
      </header>

      <section className="card form-card">
        <h2>새 신고</h2>

        <label>
          제목
          <input
            value={title}
            maxLength={60}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="예: 공학관 3층 복도 조명이 꺼져 있어요"
          />
        </label>

        <label>
          카테고리
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="">선택하세요</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label>
          설명
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="문제가 발생한 위치와 상태를 설명하세요."
            rows={5}
          />
        </label>

        <div className="button-row">
          <button className="secondary" type="button" onClick={takePhoto} disabled={busy}>
            사진 촬영
          </button>
          <button className="secondary" type="button" onClick={useCurrentLocation} disabled={busy}>
            현재 위치
          </button>
        </div>

        {photoDataUrl && (
          <div className="preview-block">
            <span>첨부 사진</span>
            <img src={photoDataUrl} alt="신고 첨부" />
          </div>
        )}

        {location && (
          <p className="meta">
            위치: {location.latitude.toFixed(5)}, {location.longitude.toFixed(5)}
          </p>
        )}

        <button className="primary" type="button" onClick={saveReport} disabled={busy}>
          {busy ? '처리 중...' : '신고 등록'}
        </button>
      </section>

      <section className="card">
        <div className="section-heading">
          <div>
            <h2>저장된 신고</h2>
            <p>{reports.length}건</p>
          </div>
          {reports.length > 0 && (
            <button className="danger-link" type="button" onClick={clearAllReports}>
              모두 삭제
            </button>
          )}
        </div>

        {reports.length === 0 ? (
          <p className="empty">아직 저장된 신고가 없습니다.</p>
        ) : (
          <div className="report-list">
            {reports.map((report) => (
              <article className="report-item" key={report.id}>
                {report.photoDataUrl && <img src={report.photoDataUrl} alt="신고" />}
                <div>
                  <div className="report-title-row">
                    <strong>{report.title}</strong>
                    <span>{report.status}</span>
                  </div>
                  <p>{report.category}</p>
                  <p>{report.description}</p>
                  <small>
                    {new Date(report.createdAt).toLocaleString()} · {report.latitude.toFixed(4)},{' '}
                    {report.longitude.toFixed(4)}
                  </small>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
