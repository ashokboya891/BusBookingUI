import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from 'src/app/Services/event-service.service';
import { NotificationService } from 'src/app/Services/notification.service';

@Component({
  selector: 'app-edit-bus-info',
  templateUrl: './edit-bus-info.component.html',
  styleUrls: ['./edit-bus-info.component.css']
})
export class EditBusInfoComponent implements OnInit {
  busForm!: FormGroup;
  eventId!: number;
  busTypes: any[] = [];
  busCategories: any[] = [];

  selectedFiles: File[] = [];
  previewUrls: string[] = [];
  existingImages: { id: number; imageUrl: string,isPrimary:string }[] = [];
  deletedImageIds: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private busService: EventService,
    private router: Router,
    private notificationService:NotificationService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));

   this.busForm = this.fb.group({
  id: [null],
  title: ['', Validators.required],
  description: [''],
  fromPlace: [''],
  toPlace: [''],
  travelDate: [''],
  totalSeats: [0],
  availableSeats: [0],
  price: [0],
  status: ['Upcoming'],
  organizer: [''],
  contactInfo: [''],
  isActive: [true],
  busTypeId: [null, Validators.required],
  busCategoryId: [null, Validators.required],
  // publicId: ['']   // optional if image is already chosen
});


    this.loadEvent();
    this.getBusTypes();
    this.getBusCategoryTypes();
  }

  getBusTypes() {
    // Fetch bus types from the service
    // Assuming busService has a method getBusTypes()
    this.busService.getBusTypes().subscribe({
      next: (types: any) => {
        this.busTypes = types;
        this.notificationService.showInfo("loaded event sucessfully")
      },
      error: () => {
        this.notificationService.showInfo("Failed to load bus types")
        console.log("Failed to load bus types");
      }
    });
  }

removeExistingImage(index: number, id: number) {
  if (!confirm("Are you sure you want to delete this photo?")) return;

  this.busService.deleteEventPhoto(this.eventId, id).subscribe({
    next: (res: any) => {
      if (res.statusCode === 200) {
        // Remove from UI
        this.existingImages.splice(index, 1);
        this.notificationService.showInfo("Photo deleted successfully")
        console.log("Photo deleted successfully");
      } else {
        this.notificationService.showInfo("Cannot delete this photo.")
        alert(res.message || "Cannot delete this photo.");
      }
    },
    error: (err) => {
        this.notificationService.showInfo("Failed to delete photo")
      console.error("Failed to delete photo", err);
      alert("Failed to delete photo.");
    }
  });
}


  getBusCategoryTypes() {
    // Fetch bus categories from the service
    // Assuming busService has a method getBusCategories()
    this.busService.getBusCategoryTypes().subscribe({
      next: (categories: any) => {
        this.busCategories = categories;
      },
      error: () => {
        this.notificationService.showError("Failed to load bus categories")
        console.log("Failed to load bus categories");
      }
    });
  }
  loadEvent() {
    this.busService.getEventById(this.eventId).subscribe({
      next: (res: any) => {
        this.busForm.patchValue(res);
        console.log(res.images);
        if (res.images && res.images.length > 0) {
          this.existingImages = res.images.map((img: any) => ({
            id: img.photoId,
            url: img.url,
            isPrimary: img.isPrimary,
            imageUrl: img.url
          }));
        }
      },
      error: () => {
        this.notificationService.showError("Failed to load event")

        console.log("Failed to load event");
      }
    });
  }

  onFileSelected(event: any) {
    const files: FileList = event.target.files;
    this.previewUrls = [];
    this.selectedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      this.selectedFiles.push(file);

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.previewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // removeNewImage(index: number) {
  //   this.previewUrls.splice(index, 1);
  //   this.selectedFiles.splice(index, 1);
  // }
onUpdate() {
  if (this.busForm.invalid) return;

  const payload = this.busForm.value;

  // ✅ ensure travelDate is in ISO format
  payload.travelDate = new Date(payload.travelDate).toISOString();

  this.busService.updateEvent(payload.id, payload).subscribe({
    next: (res) => {
      this.notificationService.showSuccess("Updated successfully");
      console.log('Updated successfully', res);
      this.onClose();
    },
    error: (err) => {
      this.notificationService.showError("Update failed")
      console.error('Update failed', err);
    }
  });
}

  // onUpdate() {
  //   if (this.busForm.invalid) return;

  //   const formData = new FormData();

    // add form values
    // Object.keys(this.busForm.value).forEach(key => {
    //   formData.append(key, this.busForm.value[key]);
    // });

    // add deleted images
    // this.deletedImageIds.forEach(id => {
    //   formData.append("deletedImageIds", id.toString());
    // });

    // add new images
  //   this.selectedFiles.forEach(file => {
  //     formData.append("newImages", file, file.name);
  //   });

  //   this.busService.updateEvent(this.eventId, formData).subscribe({
  //     next: () => {
  //       console.log("Event updated successfully");
  //       this.router.navigate(['/events']);
  //     },
  //     error: (err) => {
  //       console.error("Failed to update event", err);
  //     }
  //   });
  // }

  onDelete() {
    if (confirm('Are you sure you want to delete this event?')) {
      this.busService.deleteEvent(this.eventId).subscribe({
        next: () => {
          this.router.navigate(['/events']);
          this.notificationService.showSuccess("Deleted event sucessfullly");
        },
        error: () => {
                    this.notificationService.showSuccess("Failed to delete event");

          console.log("Failed to delete event");
        }
      });
    }
  }

  onClose() {
    this.router.navigate(['/all-events']);
  }
  

// Drag state
isDragging = false;

// Files
pendingUploads: File[] = [];
uploadProgress: { file: File; progress: number }[] = [];

onDragOver(event: DragEvent) {
  event.preventDefault();
  this.isDragging = true;
}

onDragLeave(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
}

onDrop(event: DragEvent) {
  event.preventDefault();
  this.isDragging = false;
  if (event.dataTransfer?.files?.length) {
    const files = Array.from(event.dataTransfer.files);
    this.pendingUploads.push(...files);
  }
}

onBulkFilesSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input?.files?.length) {
    this.pendingUploads.push(...Array.from(input.files));
  }
}

removeFile(index: number) {
  this.pendingUploads.splice(index, 1);
}

clearAll() {
  this.pendingUploads = [];
  this.uploadProgress = [];
}

uploadAll() {
  if (!this.eventId || this.pendingUploads.length === 0) return;

  this.uploadProgress = [];

  this.pendingUploads.forEach((file, index) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', this.eventId.toString());

    this.uploadProgress.push({ file, progress: 0 });

    this.busService.uploadProductPhoto(formData).subscribe({
      next: (event: HttpEvent<any>) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          const percent = Math.round((100 * event.loaded) / event.total);
          this.uploadProgress[index].progress = percent;
        }
      },
      complete: () => {
        this.uploadProgress[index].progress = 100;
        this.loadEvent();
      },
      error: () => {
        console.error('Upload failed for', file.name);
      }
    });
  });

  this.pendingUploads = [];
}

}
