import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { SecteurActiviteService } from './secteur-activite.service';

describe('SecteurActiviteService', () => {
  let service: SecteurActiviteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(SecteurActiviteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Vérifie qu'aucune requête HTTP inattendue n'a été faite
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all secteurs activite via GET', () => {
    const mockData = [{ id: 1, nom: 'Industrie' }, { id: 2, nom: 'Commerce' }];

    service.getAllSecteurActivites().subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    // Intercepte la requête HTTP réelle avant qu'elle ne parte
    const req = httpMock.expectOne(`${service.API_URL}/retrieve-all-secteurActivite`);
    expect(req.request.method).toBe('GET');

    // Simule la réponse du serveur, sans vrai backend
    req.flush(mockData);
  });

  it('should add a secteur activite via POST', () => {
    const newSecteur = { nom: 'Agriculture' };
    const mockResponse = { id: 3, ...newSecteur };

    service.addSecteurActivite(newSecteur).subscribe((data) => {
      expect(data).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service.API_URL}/add-secteurActivite`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newSecteur);

    req.flush(mockResponse);
  });

  it('should delete a secteur activite via DELETE', () => {
    const idToDelete = 5;

    service.deleteSecteurActivite(idToDelete).subscribe((data) => {
      expect(data).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service.API_URL}/remove-secteurActivite/${idToDelete}`);
    expect(req.request.method).toBe('DELETE');

    req.flush({ success: true });
  });
});