import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionThreadComponent } from './question-thread.component';
import { RouterModule, ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { QuestionService } from '../../services/question.service';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('QuestionThreadComponent', () => {
  let component: QuestionThreadComponent;
  let fixture: ComponentFixture<QuestionThreadComponent>;
  let questionService: jasmine.SpyObj<QuestionService>;
  
  const mockQuestion = {
    id: 1,
    title: 'Test Question',
    body: 'This is a test question body',
    votes: 10,
    answers: 5,
    views: 100,
    tags: ['angular', 'testing'],
    author: {
      id: 1,
      username: 'tester',
      reputation: 500
    },
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    const questionServiceSpy = jasmine.createSpyObj('QuestionService', ['getQuestionById']);
    questionServiceSpy.getQuestionById.and.returnValue(of(mockQuestion));

    await TestBed.configureTestingModule({
      imports: [
        QuestionThreadComponent,
        RouterModule,
        MatIconModule,
        FormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: QuestionService, useValue: questionServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({ id: '1' })
            }
          }
        }
      ]
    }).compileComponents();

    questionService = TestBed.inject(QuestionService) as jasmine.SpyObj<QuestionService>;
    fixture = TestBed.createComponent(QuestionThreadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load question details on init', () => {
    expect(questionService.getQuestionById).toHaveBeenCalledWith(1);
    expect(component.question).toEqual(mockQuestion);
  });

  it('should have answers array initialized', () => {
    expect(component.answers).toBeDefined();
    expect(component.answers.length).toBeGreaterThan(0);
  });

  it('should have edit mode variables initialized to default values', () => {
    expect(component.isEditingQuestion).toBeFalse();
    expect(component.editingAnswerId).toBeNull();
    expect(component.editQuestionBody).toEqual('');
    expect(component.editAnswerBody).toEqual('');
  });

  it('should toggle question edit mode and set edit body', () => {
    component.startQuestionEdit();
    
    expect(component.isEditingQuestion).toBeTrue();
    expect(component.editQuestionBody).toEqual(mockQuestion.body);
    
    component.cancelQuestionEdit();
    
    expect(component.isEditingQuestion).toBeFalse();
    expect(component.editQuestionBody).toEqual('');
  });

  it('should save edited question body when valid', () => {
    const newBody = 'Updated question body';
    component.startQuestionEdit();
    component.editQuestionBody = newBody;
    component.saveQuestionEdit();
    
    expect(component.question?.body).toEqual(newBody);
    expect(component.isEditingQuestion).toBeFalse();
  });

  it('should not save question edit if body is empty', () => {
    const originalBody = component.question?.body;
    component.startQuestionEdit();
    component.editQuestionBody = '   ';  // empty or whitespace only
    component.saveQuestionEdit();
    
    expect(component.question?.body).toEqual(originalBody);
  });

  it('should toggle answer edit mode and set edit body', () => {
    const answer = component.answers[0];
    component.startAnswerEdit(answer);
    
    expect(component.editingAnswerId).toEqual(answer.id);
    expect(component.editAnswerBody).toEqual(answer.body);
    
    component.cancelAnswerEdit();
    
    expect(component.editingAnswerId).toBeNull();
    expect(component.editAnswerBody).toEqual('');
  });

  it('should save edited answer body when valid', () => {
    const answer = component.answers[0];
    const newBody = 'Updated answer body';
    component.startAnswerEdit(answer);
    component.editAnswerBody = newBody;
    component.saveAnswerEdit(answer.id);
    
    const updatedAnswer = component.answers.find(a => a.id === answer.id);
    expect(updatedAnswer?.body).toEqual(newBody);
    expect(component.editingAnswerId).toBeNull();
  });

  it('should not save answer edit if body is empty', () => {
    const answer = component.answers[0];
    const originalBody = answer.body;
    component.startAnswerEdit(answer);
    component.editAnswerBody = '   ';  // empty or whitespace only
    component.saveAnswerEdit(answer.id);
    
    const updatedAnswer = component.answers.find(a => a.id === answer.id);
    expect(updatedAnswer?.body).toEqual(originalBody);
  });

  it('should clear new answer field after submission', () => {
    const consoleSpy = spyOn(console, 'log');
    component.newAnswer = 'This is a new answer';
    component.submitAnswer();
    
    expect(consoleSpy).toHaveBeenCalledWith('Submitting answer:', 'This is a new answer');
    expect(component.newAnswer).toEqual('');
  });
}); 