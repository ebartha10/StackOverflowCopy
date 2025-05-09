import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionsListComponent } from './questions-list.component';
import { RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { QuestionService } from '../../services/question.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('QuestionsListComponent', () => {
  let component: QuestionsListComponent;
  let fixture: ComponentFixture<QuestionsListComponent>;
  let questionService: jasmine.SpyObj<QuestionService>;
  
  const mockQuestions = [
    {
      id: 1,
      title: 'Test Question 1',
      body: 'This is test question 1',
      votes: 10,
      answers: 5,
      views: 100,
      tags: ['angular', 'testing'],
      author: {
        id: 1,
        username: 'tester1',
        reputation: 500
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      title: 'Test Question 2',
      body: 'This is test question 2',
      votes: 5,
      answers: 2,
      views: 50,
      tags: ['javascript', 'react'],
      author: {
        id: 2,
        username: 'tester2',
        reputation: 300
      },
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      title: 'Test Question 3',
      body: 'This is test question 3',
      votes: 7,
      answers: 3,
      views: 75,
      tags: ['angular', 'typescript'],
      author: {
        id: 3,
        username: 'tester3',
        reputation: 400
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  beforeEach(async () => {
    const questionServiceSpy = jasmine.createSpyObj('QuestionService', ['getQuestions']);
    questionServiceSpy.getQuestions.and.returnValue(of(mockQuestions));

    await TestBed.configureTestingModule({
      imports: [
        QuestionsListComponent,
        RouterModule,
        MatIconModule,
        MatButtonModule,
        MatMenuModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: QuestionService, useValue: questionServiceSpy }
      ]
    }).compileComponents();

    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    fixture = TestBed.createComponent(QuestionsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load questions on init', () => {
    expect(questionService.getQuestions).toHaveBeenCalled();
    expect(component.questions).toEqual(mockQuestions);
    expect(component.filteredQuestions).toEqual(mockQuestions);
  });

  it('should filter tags based on search input', () => {
    // All tags are visible initially
    expect(component.filteredTags.length).toBe(component.allTags.length);
    
    // Filter for 'script' should return 'javascript' and 'typescript'
    component.tagSearch = 'script';
    component.filterTags();
    expect(component.filteredTags.length).toBe(2);
    expect(component.filteredTags).toContain('javascript');
    expect(component.filteredTags).toContain('typescript');
    
    // Filter for 'ang' should return 'angular'
    component.tagSearch = 'ang';
    component.filterTags();
    expect(component.filteredTags.length).toBe(1);
    expect(component.filteredTags).toContain('angular');
    
    // Empty search should show all tags
    component.tagSearch = '';
    component.filterTags();
    expect(component.filteredTags.length).toBe(component.allTags.length);
  });

  it('should add and remove tags from selected tags list', () => {
    expect(component.selectedTags.length).toBe(0);
    
    // Add 'angular' tag
    component.toggleTag('angular');
    expect(component.selectedTags.length).toBe(1);
    expect(component.selectedTags).toContain('angular');
    
    // Add 'typescript' tag
    component.toggleTag('typescript');
    expect(component.selectedTags.length).toBe(2);
    expect(component.selectedTags).toContain('typescript');
    
    // Remove 'angular' tag
    component.toggleTag('angular');
    expect(component.selectedTags.length).toBe(1);
    expect(component.selectedTags).not.toContain('angular');
    expect(component.selectedTags).toContain('typescript');
  });

  it('should filter questions based on selected tags', () => {
    // Initially all questions are shown
    expect(component.filteredQuestions.length).toBe(mockQuestions.length);
    
    // Filter by 'angular' tag - should show questions 1 and 3
    component.toggleTag('angular');
    expect(component.filteredQuestions.length).toBe(2);
    expect(component.filteredQuestions.find(q => q.id === 1)).toBeTruthy();
    expect(component.filteredQuestions.find(q => q.id === 3)).toBeTruthy();
    expect(component.filteredQuestions.find(q => q.id === 2)).toBeFalsy();
    
    // Add 'javascript' tag - should also show question 2
    component.toggleTag('javascript');
    expect(component.filteredQuestions.length).toBe(3);
    expect(component.filteredQuestions.find(q => q.id === 1)).toBeTruthy();
    expect(component.filteredQuestions.find(q => q.id === 2)).toBeTruthy();
    expect(component.filteredQuestions.find(q => q.id === 3)).toBeTruthy();
    
    // Remove all tags - should show all questions
    component.toggleTag('angular');
    component.toggleTag('javascript');
    expect(component.filteredQuestions.length).toBe(mockQuestions.length);
  });
}); 