# Portal usecase 

```javascript use case for PortalTemplate
import PortalTemplate from '@Templates/PortalTemplate';
import DeleteConfirmationOverlayTable from '@Organisms/PopupOverlays/DeleteConfirmationOverlayTable';
 const [confirmDelete, setConfirmDelete] = useState<boolean>(false);

 {confirmDelete && (
        <PortalTemplate>
          <DeleteConfirmationOverlayTable
            onClose={() => setConfirmDelete(false)}
            onDelete={() => {
              deleteGenderMarker(selectedData?.id);
              setConfirmDelete(false);
            }}
            title="Organization"
            dataKey="name"
            data={selectedData}
          />
        </PortalTemplate>
      )}

```