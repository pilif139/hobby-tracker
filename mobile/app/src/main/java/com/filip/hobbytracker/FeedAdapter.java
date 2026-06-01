package com.filip.hobbytracker;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.HorizontalScrollView;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.filip.hobbytracker.api.generated.model.GetFeed200ResponseSessionsInner;

import java.util.ArrayList;
import java.util.List;

public class FeedAdapter extends RecyclerView.Adapter<FeedAdapter.ViewHolder> {

    private final List<GetFeed200ResponseSessionsInner> sessions = new ArrayList<>();

    public void clearSessions() {
        sessions.clear();
        notifyDataSetChanged();
    }

    public void addSessions(List<GetFeed200ResponseSessionsInner> newSessions) {
        int startPosition = sessions.size();
        sessions.addAll(newSessions);
        notifyItemRangeInserted(startPosition, newSessions.size());
    }

    @NonNull
    @Override
    public ViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_feed_session, parent, false);
        return new ViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ViewHolder holder, int position) {
        GetFeed200ResponseSessionsInner session = sessions.get(position);
        holder.tvUserName.setText(session.getUser().getName());
        holder.tvHobbyName.setText(session.getHobby().getName());
        holder.tvNotes.setText(session.getNotes());

        List<String> imageUrls = session.getImageUrls();
        holder.llImages.removeAllViews();
        if (imageUrls != null && !imageUrls.isEmpty()) {
            holder.hsvImages.setVisibility(View.VISIBLE);
            int sizePx = (int) (120 * holder.itemView.getContext().getResources().getDisplayMetrics().density);
            int marginPx = (int) (4 * holder.itemView.getContext().getResources().getDisplayMetrics().density);
            for (String url : imageUrls) {
                ImageView imageView = new ImageView(holder.itemView.getContext());
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(sizePx, sizePx);
                params.rightMargin = marginPx;
                imageView.setLayoutParams(params);
                imageView.setScaleType(ImageView.ScaleType.CENTER_CROP);
                String resolvedUrl = url.replace("localhost", "10.0.2.2");
                Glide.with(holder.itemView.getContext()).load(resolvedUrl).into(imageView);
                holder.llImages.addView(imageView);
            }
        } else {
            holder.hsvImages.setVisibility(View.GONE);
        }
    }

    @Override
    public int getItemCount() {
        return sessions.size();
    }

    static class ViewHolder extends RecyclerView.ViewHolder {
        TextView tvUserName, tvHobbyName, tvNotes;
        HorizontalScrollView hsvImages;
        LinearLayout llImages;

        ViewHolder(View itemView) {
            super(itemView);
            tvUserName = itemView.findViewById(R.id.tvUserName);
            tvHobbyName = itemView.findViewById(R.id.tvHobbyName);
            tvNotes = itemView.findViewById(R.id.tvNotes);
            hsvImages = itemView.findViewById(R.id.hsvImages);
            llImages = itemView.findViewById(R.id.llImages);
        }
    }
}
