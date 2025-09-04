import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/Services/event-service.service';
import { BusEvent } from './../../Models/BusEvent ';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-add-bus-event',
  templateUrl: './add-bus-event.component.html',
  styleUrls: ['./add-bus-event.component.css']
})
export class AddBusEventComponent implements OnInit {
  busForm!: FormGroup;
  busTypes: any[] = [];
  busCategories: any[] = [];
  eventId: number | null = null;
  isDragging = false;

  // Upload state
  pendingUploads: File[] = [];
  uploadProgress: { file: File; progress: number }[] = [];

  constructor(private fb: FormBuilder, private eventService: EventService,private notificationService:NotificationService) {}

  ngOnInit(): void {
    this.busForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      fromPlace: ['', Validators.required],
      toPlace: ['', Validators.required],
      travelDate: ['', Validators.required],
      totalSeats: [0, [Validators.required, Validators.min(1)]],
      availableSeats: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      status: ['', Validators.required],
      organizer: ['', Validators.required],
      contactInfo: ['', Validators.required],
      busTypeId: ['', Validators.required],
      busCategoryId: ['', Validators.required],
      isActive: [true]
    });
    this.loadBusTypes();
    this.loadBusCategories();
  }
    // Load bus types from API
  loadBusTypes() {
    this.eventService.getBusTypes().subscribe({
      next: (res) => {
        this.busTypes = res;
      },
      error: (err) => console.error(err)
    });
  }

  // Load bus categories from API
  loadBusCategories() {
    this.eventService.getBusCategoryTypes().subscribe({
      next: (res) => {
        this.busCategories = res;
      },
      error: (err) => console.error(err)
    });
  }

  // Save event → backend returns id
  onSave(): void {
    if (this.busForm.invalid) return;

    this.eventService.addEvent(this.busForm.value).subscribe({
      next: (res: any) => {
        this.eventId = res.id;
        this.notificationService.showSuccess("✅ Event created successfully. Now you can upload photos.'");
        alert('✅ Event created successfully. Now you can upload photos.');
      },
      error: (err) => {
        console.error(err);
        this.notificationService.error("❌ Failed to create event.");
        alert('❌ Failed to create event.');
      }
    });
  }

  onClear(): void {
    this.busForm.reset();
    this.eventId = null;
    this.pendingUploads = [];
    this.uploadProgress = [];
  }

  // -------- Image Handling --------
  onBulkFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.pendingUploads.push(...Array.from(input.files));
    }
  }

  removeFile(index: number): void {
    this.pendingUploads.splice(index, 1);
  }

  clearAll(): void {
    this.pendingUploads = [];
    this.uploadProgress = [];
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (event.dataTransfer?.files) {
      this.pendingUploads.push(...Array.from(event.dataTransfer.files));
    }
  }

  // Upload all pending images
  uploadAll(): void {
    if (!this.eventId || this.pendingUploads.length === 0) return;

    this.pendingUploads.forEach((file, index) => {
      this.eventService.uploadEventPhotos(this.eventId!, [file]).subscribe({
        next: (event) => {
          if (event.type === HttpEventType.UploadProgress && event.total) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.uploadProgress[index] = { file, progress };
          } else if (event.type === HttpEventType.Response) {
            this.uploadProgress[index] = { file, progress: 100 };
          }
        },
        error: (err) => console.error(err)
      });
    });

    this.pendingUploads = [];
  }
}
