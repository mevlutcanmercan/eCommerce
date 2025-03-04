import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CommentService } from '../../services/comment.service';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Comment } from '../../services/comment.service';
import { MatCard, MatCardContent, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatList, MatListItem } from '@angular/material/list';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {MatExpansionModule} from '@angular/material/expansion';
import { AuthService } from '../../services/auth.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
    selector: 'app-comment-section',
    standalone:true,
    imports: [NgIf, NgFor, ReactiveFormsModule, FormsModule, CommonModule,
        MatCard, MatCardTitle, MatCardContent,
         MatListItem, MatFormField, MatLabel, MatInput, MatButton,
        MatDivider, MatExpansionModule, MatError, MatIcon
    ],
    templateUrl: './comment-section.component.html',
    styleUrl: './comment-section.component.scss'
})
export class CommentSectionComponent implements OnInit, OnChanges {
  @Input()
  productId!: string | undefined;
  comments: Comment[] = [];
  commentForm: FormGroup;

  constructor(
    private commentService: CommentService,
    private fb: FormBuilder,
    private authService: AuthService,
    private snackbar :SnackbarService
  ) {
    this.commentForm = this.fb.group({
      comment: ['', Validators.required],
      rate: [0, [Validators.required, Validators.min(1), Validators.max(5)]]
    });
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productId'] && this.productId) {
      this.loadComments();
    }
  }

  loadComments(): void {
    this.commentService.getCommentsByProductId(this.productId!).subscribe(comments => {
          this.comments = comments;
    });
  }

  onSubmit(): void {
    if (this.authService.isLoggedIn) {
      if (this.commentForm.valid) {
        const newComment: Partial<Comment> = {
          comment: this.commentForm.value.comment,
          rate: this.commentForm.value.rate
        };

        this.commentService.addComment(this.productId!, newComment).subscribe(comments => {
          this.comments.push(comments);
          this.commentForm.reset({ comment: '', rate: 0 });
        });
      }
    }
    else{
      console.log("giriş yap")

    }
  }

  setRating(rating: number): void {
    this.commentForm.patchValue({ rate: rating });
  }
}
