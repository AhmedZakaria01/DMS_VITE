import { useState, useRef, useEffect } from "react";
import {
  Upload,
  Trash2,
  Download,
  RefreshCw,
  Undo,
  Image as ImageIcon,
} from "lucide-react";

const Annotations = () => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mode, setMode] = useState("blackbox"); // 'blackbox' or 'stamp'

  // Drawing states
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState(null);
  const [currentAnnotation, setCurrentAnnotation] = useState(null);

  // Annotations array with dimensions
  const [annotations, setAnnotations] = useState([]);

  // Stamp related
  const [uploadedStamps, setUploadedStamps] = useState([]);
  const [selectedStamp, setSelectedStamp] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedAnnotation, setDraggedAnnotation] = useState(null);
  const [resizeHandle, setResizeHandle] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const stampInputRef = useRef(null);

  // Handle image upload
  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            src: e.target.result,
            name: file.name,
            annotations: [],
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  // Handle stamp upload
  const handleStampUpload = (event) => {
    const files = Array.from(event.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newStamp = {
          id: Date.now() + Math.random(),
          src: e.target.result,
          name: file.name,
        };
        setUploadedStamps((prev) => [...prev, newStamp]);
        setSelectedStamp(newStamp); // Auto-select the uploaded stamp
      };
      reader.readAsDataURL(file);
    });

    event.target.value = "";
  };

  // Select image for editing
  const selectImage = (image) => {
    setSelectedImage(image);
    setAnnotations(image.annotations || []);
    setCurrentAnnotation(null);
    setDraggedAnnotation(null);
  };

  // Delete image
  const deleteImage = (imageId) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
      setAnnotations([]);
    }
  };

  // Get canvas coordinates
  const getCanvasCoordinates = (e) => {
    if (!canvasRef.current) return null;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Check if point is inside annotation
  const isPointInAnnotation = (point, annotation) => {
    return (
      point.x >= annotation.x &&
      point.x <= annotation.x + annotation.width &&
      point.y >= annotation.y &&
      point.y <= annotation.y + annotation.height
    );
  };

  // Check if point is on resize handle
  const getResizeHandle = (point, annotation) => {
    const handleSize = 15;
    const corners = {
      nw: { x: annotation.x, y: annotation.y },
      ne: { x: annotation.x + annotation.width, y: annotation.y },
      sw: { x: annotation.x, y: annotation.y + annotation.height },
      se: {
        x: annotation.x + annotation.width,
        y: annotation.y + annotation.height,
      },
    };

    for (const [handle, pos] of Object.entries(corners)) {
      if (
        Math.abs(point.x - pos.x) < handleSize &&
        Math.abs(point.y - pos.y) < handleSize
      ) {
        return handle;
      }
    }
    return null;
  };

  // Canvas drawing and rendering
  useEffect(() => {
    if (!selectedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw base image
      ctx.drawImage(img, 0, 0);

      // Draw all annotations
      annotations.forEach((annotation) => {
        if (annotation.type === "blackbox") {
          ctx.fillStyle = "black";
          ctx.fillRect(
            annotation.x,
            annotation.y,
            annotation.width,
            annotation.height
          );

          // Draw border and resize handles for selected black box
          if (draggedAnnotation?.id === annotation.id) {
            ctx.strokeStyle = "#ef4444";
            ctx.lineWidth = 3;
            ctx.strokeRect(
              annotation.x,
              annotation.y,
              annotation.width,
              annotation.height
            );

            // Draw resize handles
            const handleSize = 10;
            ctx.fillStyle = "#ef4444";
            // Top-left
            ctx.fillRect(
              annotation.x - handleSize / 2,
              annotation.y - handleSize / 2,
              handleSize,
              handleSize
            );
            // Top-right
            ctx.fillRect(
              annotation.x + annotation.width - handleSize / 2,
              annotation.y - handleSize / 2,
              handleSize,
              handleSize
            );
            // Bottom-left
            ctx.fillRect(
              annotation.x - handleSize / 2,
              annotation.y + annotation.height - handleSize / 2,
              handleSize,
              handleSize
            );
            // Bottom-right
            ctx.fillRect(
              annotation.x + annotation.width - handleSize / 2,
              annotation.y + annotation.height - handleSize / 2,
              handleSize,
              handleSize
            );
          }
        } else if (annotation.type === "stamp") {
          const stampImg = new Image();
          stampImg.src = annotation.src;
          stampImg.onload = () => {
            ctx.drawImage(
              stampImg,
              annotation.x,
              annotation.y,
              annotation.width,
              annotation.height
            );

            // Draw border for selected annotation
            if (draggedAnnotation?.id === annotation.id) {
              ctx.strokeStyle = "#3b82f6";
              ctx.lineWidth = 3;
              ctx.strokeRect(
                annotation.x,
                annotation.y,
                annotation.width,
                annotation.height
              );

              // Draw resize handles
              const handleSize = 10;
              ctx.fillStyle = "#3b82f6";
              // Top-left
              ctx.fillRect(
                annotation.x - handleSize / 2,
                annotation.y - handleSize / 2,
                handleSize,
                handleSize
              );
              // Top-right
              ctx.fillRect(
                annotation.x + annotation.width - handleSize / 2,
                annotation.y - handleSize / 2,
                handleSize,
                handleSize
              );
              // Bottom-left
              ctx.fillRect(
                annotation.x - handleSize / 2,
                annotation.y + annotation.height - handleSize / 2,
                handleSize,
                handleSize
              );
              // Bottom-right
              ctx.fillRect(
                annotation.x + annotation.width - handleSize / 2,
                annotation.y + annotation.height - handleSize / 2,
                handleSize,
                handleSize
              );
            }
          };
        }
      });

      // Draw current annotation being created
      if (currentAnnotation) {
        if (currentAnnotation.type === "blackbox") {
          ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
          ctx.fillRect(
            currentAnnotation.x,
            currentAnnotation.y,
            currentAnnotation.width,
            currentAnnotation.height
          );
        } else if (currentAnnotation.type === "stamp") {
          const stampImg = new Image();
          stampImg.src = currentAnnotation.src;
          stampImg.onload = () => {
            ctx.globalAlpha = 0.7;
            ctx.drawImage(
              stampImg,
              currentAnnotation.x,
              currentAnnotation.y,
              currentAnnotation.width,
              currentAnnotation.height
            );
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = "#3b82f6";
            ctx.lineWidth = 2;
            ctx.strokeRect(
              currentAnnotation.x,
              currentAnnotation.y,
              currentAnnotation.width,
              currentAnnotation.height
            );
          };
        }
      }
    };

    img.src = selectedImage.src;
  }, [selectedImage, annotations, currentAnnotation, draggedAnnotation]);

  // Mouse down handler
  const handleMouseDown = (e) => {
    const point = getCanvasCoordinates(e);
    if (!point) return;

    // Check if clicking on existing annotation (both stamps and blackboxes) for dragging/resizing
    for (let i = annotations.length - 1; i >= 0; i--) {
      const annotation = annotations[i];

      // Check resize handles first
      const handle = getResizeHandle(point, annotation);
      if (handle) {
        setIsResizing(true);
        setResizeHandle(handle);
        setDraggedAnnotation(annotation);
        setStartPoint(point);
        console.log("Started resizing:", annotation.type, annotation);
        return;
      }

      // Then check if clicking inside annotation for dragging
      if (isPointInAnnotation(point, annotation)) {
        setIsDragging(true);
        setDraggedAnnotation(annotation);
        setDragOffset({
          x: point.x - annotation.x,
          y: point.y - annotation.y,
        });
        console.log("Started dragging:", annotation.type, annotation);
        return;
      }
    }

    // Start drawing new annotation
    if (mode === "blackbox") {
      setIsDrawing(true);
      setStartPoint(point);
    } else if (mode === "stamp" && selectedStamp) {
      setIsDrawing(true);
      setStartPoint(point);
      setCurrentAnnotation({
        id: Date.now() + Math.random(),
        type: "stamp",
        src: selectedStamp.src,
        x: point.x,
        y: point.y,
        width: 100,
        height: 100,
      });
    }
  };

  // Mouse move handler
  const handleMouseMove = (e) => {
    const point = getCanvasCoordinates(e);
    if (!point) return;

    if (isDragging && draggedAnnotation) {
      const newX = point.x - dragOffset.x;
      const newY = point.y - dragOffset.y;

      setAnnotations((prev) =>
        prev.map((ann) =>
          ann.id === draggedAnnotation.id ? { ...ann, x: newX, y: newY } : ann
        )
      );
      setDraggedAnnotation((prev) => ({ ...prev, x: newX, y: newY }));
    } else if (isResizing && draggedAnnotation && startPoint) {
      const dx = point.x - startPoint.x;
      const dy = point.y - startPoint.y;

      setAnnotations((prev) =>
        prev.map((ann) => {
          if (ann.id === draggedAnnotation.id) {
            let newAnn = { ...ann };

            if (resizeHandle === "se") {
              // Bottom-right: increase width and height
              newAnn.width = Math.max(20, ann.width + dx);
              newAnn.height = Math.max(20, ann.height + dy);
            } else if (resizeHandle === "sw") {
              // Bottom-left: change x and width, increase height
              newAnn.width = Math.max(20, ann.width - dx);
              newAnn.height = Math.max(20, ann.height + dy);
              if (newAnn.width > 20) newAnn.x = ann.x + dx;
            } else if (resizeHandle === "ne") {
              // Top-right: increase width, change y and height
              newAnn.width = Math.max(20, ann.width + dx);
              newAnn.height = Math.max(20, ann.height - dy);
              if (newAnn.height > 20) newAnn.y = ann.y + dy;
            } else if (resizeHandle === "nw") {
              // Top-left: change x and y, change width and height
              newAnn.width = Math.max(20, ann.width - dx);
              newAnn.height = Math.max(20, ann.height - dy);
              if (newAnn.width > 20) newAnn.x = ann.x + dx;
              if (newAnn.height > 20) newAnn.y = ann.y + dy;
            }

            return newAnn;
          }
          return ann;
        })
      );

      setDraggedAnnotation((prev) => {
        let newAnn = { ...prev };

        if (resizeHandle === "se") {
          newAnn.width = Math.max(20, prev.width + dx);
          newAnn.height = Math.max(20, prev.height + dy);
        } else if (resizeHandle === "sw") {
          newAnn.width = Math.max(20, prev.width - dx);
          newAnn.height = Math.max(20, prev.height + dy);
          if (newAnn.width > 20) newAnn.x = prev.x + dx;
        } else if (resizeHandle === "ne") {
          newAnn.width = Math.max(20, prev.width + dx);
          newAnn.height = Math.max(20, prev.height - dy);
          if (newAnn.height > 20) newAnn.y = prev.y + dy;
        } else if (resizeHandle === "nw") {
          newAnn.width = Math.max(20, prev.width - dx);
          newAnn.height = Math.max(20, prev.height - dy);
          if (newAnn.width > 20) newAnn.x = prev.x + dx;
          if (newAnn.height > 20) newAnn.y = prev.y + dy;
        }

        return newAnn;
      });
      setStartPoint(point);
    } else if (isDrawing && startPoint) {
      if (mode === "blackbox") {
        setCurrentAnnotation({
          id: Date.now() + Math.random(),
          type: "blackbox",
          x: Math.min(startPoint.x, point.x),
          y: Math.min(startPoint.y, point.y),
          width: Math.abs(point.x - startPoint.x),
          height: Math.abs(point.y - startPoint.y),
        });
      } else if (mode === "stamp" && currentAnnotation) {
        setCurrentAnnotation((prev) => ({
          ...prev,
          x: Math.min(startPoint.x, point.x),
          y: Math.min(startPoint.y, point.y),
          width: Math.abs(point.x - startPoint.x),
          height: Math.abs(point.y - startPoint.y),
        }));
      }
    }
  };

  // Mouse up handler
  const handleMouseUp = () => {
    if (isDragging || isResizing) {
      // Update image annotations
      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === selectedImage.id ? { ...img, annotations } : img
        )
      );

      if (draggedAnnotation) {
        console.log("Finished editing annotation:", draggedAnnotation.type, {
          id: draggedAnnotation.id,
          type: draggedAnnotation.type,
          x: Math.round(draggedAnnotation.x),
          y: Math.round(draggedAnnotation.y),
          width: Math.round(draggedAnnotation.width),
          height: Math.round(draggedAnnotation.height),
        });
      }

      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle(null);
    } else if (
      isDrawing &&
      currentAnnotation &&
      currentAnnotation.width > 5 &&
      currentAnnotation.height > 5
    ) {
      const newAnnotations = [...annotations, currentAnnotation];
      setAnnotations(newAnnotations);

      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === selectedImage.id
            ? { ...img, annotations: newAnnotations }
            : img
        )
      );

      console.log("Created new annotation:", currentAnnotation.type, {
        id: currentAnnotation.id,
        type: currentAnnotation.type,
        x: Math.round(currentAnnotation.x),
        y: Math.round(currentAnnotation.y),
        width: Math.round(currentAnnotation.width),
        height: Math.round(currentAnnotation.height),
      });

      setIsDrawing(false);
      setStartPoint(null);
      setCurrentAnnotation(null);
    } else {
      setIsDrawing(false);
      setStartPoint(null);
      setCurrentAnnotation(null);
    }
  };

  // Undo last annotation
  const undoLastAnnotation = () => {
    if (annotations.length === 0) return;

    const newAnnotations = annotations.slice(0, -1);
    setAnnotations(newAnnotations);
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === selectedImage.id
          ? { ...img, annotations: newAnnotations }
          : img
      )
    );
  };

  // Clear all annotations
  const clearAnnotations = () => {
    setAnnotations([]);
    setUploadedImages((prev) =>
      prev.map((img) =>
        img.id === selectedImage.id ? { ...img, annotations: [] } : img
      )
    );
  };

  // Download annotated image (without borders/handles)
  const downloadImage = () => {
    if (!canvasRef.current || !selectedImage) return;

    // Create a temporary canvas for clean download
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      tempCanvas.width = img.width;
      tempCanvas.height = img.height;

      // Draw base image
      tempCtx.drawImage(img, 0, 0);

      // Draw all annotations WITHOUT borders and handles
      annotations.forEach((annotation) => {
        if (annotation.type === "blackbox") {
          tempCtx.fillStyle = "black";
          tempCtx.fillRect(
            annotation.x,
            annotation.y,
            annotation.width,
            annotation.height
          );
        } else if (annotation.type === "stamp") {
          const stampImg = new Image();
          stampImg.src = annotation.src;
          stampImg.onload = () => {
            tempCtx.drawImage(
              stampImg,
              annotation.x,
              annotation.y,
              annotation.width,
              annotation.height
            );
          };
        }
      });

      // Wait a bit for stamp images to load, then download
      setTimeout(() => {
        const link = document.createElement("a");
        link.download = `annotated_${selectedImage.name}`;
        link.href = tempCanvas.toDataURL();
        link.click();
        console.log("Downloaded clean image without borders/handles");
      }, 500);
    };

    img.src = selectedImage.src;
  };

  // Export annotations data (for backend)
  const exportAnnotationsData = () => {
    const data = {
      imageId: selectedImage.id,
      imageName: selectedImage.name,
      imageWidth: canvasRef.current.width,
      imageHeight: canvasRef.current.height,
      annotations: annotations.map((ann) => ({
        id: ann.id,
        type: ann.type,
        x: Math.round(ann.x),
        y: Math.round(ann.y),
        width: Math.round(ann.width),
        height: Math.round(ann.height),
        ...(ann.type === "stamp" && { stampSrc: ann.src }),
      })),
    };

    console.log("=".repeat(80));
    console.log("📊 ANNOTATIONS DATA FOR BACKEND");
    console.log("=".repeat(80));
    console.log("Image Info:", {
      id: data.imageId,
      name: data.imageName,
      width: data.imageWidth,
      height: data.imageHeight,
    });
    console.log("\nAnnotations Count:", data.annotations.length);
    console.log("\nAll Annotations:");
    data.annotations.forEach((ann, index) => {
      console.log(`\n  ${index + 1}. ${ann.type.toUpperCase()}:`);
      console.log(`     - ID: ${ann.id}`);
      console.log(`     - Position: (${ann.x}, ${ann.y})`);
      console.log(`     - Size: ${ann.width} x ${ann.height}`);
      if (ann.stampSrc) {
        console.log(`     - Stamp Source: ${ann.stampSrc.substring(0, 50)}...`);
      }
    });
    console.log("\n" + "=".repeat(80));
    console.log("Full JSON Data:");
    console.log(JSON.stringify(data, null, 2));
    console.log("=".repeat(80));

    alert(
      `Annotations data logged to console!\n\nTotal annotations: ${
        data.annotations.length
      }\n- Black boxes: ${
        data.annotations.filter((a) => a.type === "blackbox").length
      }\n- Stamps: ${
        data.annotations.filter((a) => a.type === "stamp").length
      }\n\nCheck developer tools for detailed data.`
    );
    return data;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Image Annotation Tool
          </h1>
          <p className="text-gray-600">
            Upload images and add annotations (black boxes or stamps)
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Upload Images
            </h2>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Upload className="w-5 h-5" />
              Upload Images
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileUpload}
            className="hidden"
          />

          {/* Image Gallery */}
          {uploadedImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((image) => (
                <div
                  key={image.id}
                  className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage?.id === image.id
                      ? "border-blue-500 shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => selectImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.name}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteImage(image.id);
                      }}
                      className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="p-2 bg-white">
                    <p className="text-sm text-gray-700 truncate">
                      {image.name}
                    </p>
                    {image.annotations && image.annotations.length > 0 && (
                      <p className="text-xs text-blue-600">
                        {image.annotations.length} annotations
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">No images uploaded yet</p>
              <p className="text-sm text-gray-500">
                Click the upload button to add images
              </p>
            </div>
          )}
        </div>

        {/* Editor Section */}
        {selectedImage && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar - Tools */}
            <div className="lg:col-span-1 space-y-6">
              {/* Mode Selector */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Annotation Mode
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setMode("blackbox")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      mode === "blackbox"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <div className="w-6 h-6 bg-black rounded"></div>
                    <span className="font-medium">Black Box</span>
                  </button>
                  <button
                    onClick={() => setMode("stamp")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      mode === "stamp"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    <ImageIcon className="w-6 h-6" />
                    <span className="font-medium">Stamp</span>
                  </button>
                </div>
              </div>

              {/* Stamp Upload */}
              {mode === "stamp" && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Upload Stamps
                  </h3>
                  <button
                    onClick={() => stampInputRef.current?.click()}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors mb-4"
                  >
                    <Upload className="w-4 h-4 inline mr-2" />
                    Upload Stamp
                  </button>
                  <input
                    ref={stampInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleStampUpload}
                    className="hidden"
                  />

                  {/* Stamp Gallery */}
                  {uploadedStamps.length > 0 && (
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {uploadedStamps.map((stamp) => (
                        <div
                          key={stamp.id}
                          onClick={() => setSelectedStamp(stamp)}
                          className={`p-2 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedStamp?.id === stamp.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <img
                            src={stamp.src}
                            alt={stamp.name}
                            className="w-full h-20 object-contain bg-white rounded"
                          />
                          <p className="text-xs text-gray-600 mt-1 truncate">
                            {stamp.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {uploadedStamps.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No stamps uploaded yet
                    </p>
                  )}
                </div>
              )}

              {/* Annotations List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Annotations ({annotations.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {annotations.map((ann, index) => (
                    <div
                      key={ann.id}
                      onClick={() => setDraggedAnnotation(ann)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        draggedAnnotation?.id === ann.id
                          ? ann.type === "blackbox"
                            ? "bg-red-50 border-red-500 shadow-md"
                            : "bg-blue-50 border-blue-500 shadow-md"
                          : "bg-gray-50 border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`text-sm font-medium ${
                            draggedAnnotation?.id === ann.id
                              ? ann.type === "blackbox"
                                ? "text-red-700"
                                : "text-blue-700"
                              : "text-gray-700"
                          }`}
                        >
                          {ann.type === "blackbox" ? "Black Box" : "Stamp"} #
                          {index + 1}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const newAnnotations = annotations.filter(
                              (a) => a.id !== ann.id
                            );
                            setAnnotations(newAnnotations);
                            setUploadedImages((prev) =>
                              prev.map((img) =>
                                img.id === selectedImage.id
                                  ? { ...img, annotations: newAnnotations }
                                  : img
                              )
                            );
                            if (draggedAnnotation?.id === ann.id) {
                              setDraggedAnnotation(null);
                            }
                            console.log(
                              "Deleted annotation:",
                              ann.type,
                              ann.id
                            );
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div
                        className={`text-xs space-y-0.5 ${
                          draggedAnnotation?.id === ann.id
                            ? ann.type === "blackbox"
                              ? "text-red-600"
                              : "text-blue-600"
                            : "text-gray-600"
                        }`}
                      >
                        <div>
                          X: {Math.round(ann.x)}px, Y: {Math.round(ann.y)}px
                        </div>
                        <div>
                          W: {Math.round(ann.width)}px, H:{" "}
                          {Math.round(ann.height)}px
                        </div>
                      </div>
                    </div>
                  ))}
                  {annotations.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No annotations yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Canvas Area */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      Edit: {selectedImage.name}
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {mode === "blackbox" &&
                        "Click and drag to draw black boxes. Click existing boxes to drag/resize."}
                      {mode === "stamp" &&
                        "Select a stamp, then click and drag to place it. Click existing stamps to drag/resize."}
                    </p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={undoLastAnnotation}
                      disabled={annotations.length === 0}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <Undo className="w-4 h-4" />
                      Undo
                    </button>
                    <button
                      onClick={clearAnnotations}
                      disabled={annotations.length === 0}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Reset
                    </button>
                    <button
                      onClick={exportAnnotationsData}
                      disabled={annotations.length === 0}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                      Export
                    </button>
                    <button
                      onClick={downloadImage}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                </div>

                {/* Canvas */}
                <div className="border border-gray-300 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className="max-w-full max-h-[600px] cursor-crosshair"
                    style={{ display: "block" }}
                  />
                </div>

                {/* Info */}
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900">
                    <strong>
                      Mode: {mode === "blackbox" ? "Black Box" : "Stamp"}
                    </strong>
                  </p>
                  <p className="text-sm text-blue-900 mt-1">
                    {mode === "blackbox" &&
                      "Draw filled black boxes to redact/hide areas. Click existing boxes to select (red border), then drag to move or drag corners to resize. All boxes include dimensions (x, y, width, height)."}
                    {mode === "stamp" &&
                      "Place stamps on the image. Click existing stamps to select (blue border), then drag to move or drag corners to resize. All stamps include dimensions (x, y, width, height)."}
                  </p>
                  {mode === "stamp" && !selectedStamp && (
                    <p className="text-sm text-orange-600 mt-2">
                      <strong>Note:</strong> Please upload and select a stamp
                      first!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Annotations;
